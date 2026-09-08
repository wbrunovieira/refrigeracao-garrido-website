#!/usr/bin/env bash
# pm.sh — thin CLI for the WB Project Manager board (Refrigeração Garrido Website).
# Session tooling under .claude/, so we stop hand-writing curl+python each time.
#
# Reads the API key from ~/.wb-project-manager-api-key (never echoed). Needs curl + python3.
#
# Issues:
#   pm.sh list [STATUS]              # STATUS in backlog|todo|inprogress|done|canceled
#   pm.sh find <keyword>             # issues whose title matches keyword (case-insensitive)
#   pm.sh get <issueId>              # one issue (id | status | title + description)
#   pm.sh status <issueId> <name>    # set status: backlog|todo|inprogress|done|canceled
#   pm.sh done <issueId>             # shortcut: status -> done
#   pm.sh start <issueId>            # shortcut: status -> inprogress
#   pm.sh create <title> [opts]      # --desc "..." | --desc-file F | --status NAME
#                                    # --type T (default IMPROVEMENT) | --priority P (default MEDIUM)
#                                    # --milestone <milestoneId>
#   pm.sh desc <issueId> [opts]      # --desc "..." | --desc-file F | --append
#
# Milestones:
#   pm.sh ms list                    # milestones do projeto (id | nome | alvo)
#   pm.sh ms create <nome> [--target YYYY-MM-DD] [--desc "..."]
#   pm.sh ms set <issueId> <milestoneId|none>   # vincula/desvincula uma issue
#
# Examples:
#   pm.sh find contato
#   pm.sh ms create "Fase 1 — Site institucional" --target 2026-10-31
#   pm.sh create "Home — seção de serviços" --status todo --priority HIGH --milestone cmxxx
#   pm.sh ms set cmyyy cmxxx
set -euo pipefail

BASE="https://projects.wbdigitalsolutions.com"
PROJECT_ID="cmtstixt000o5s501zmcy0rvp"
WORKSPACE_ID="cmge96f200001wa7ouziczg0w"
KEY_FILE="$HOME/.wb-project-manager-api-key"

[ -f "$KEY_FILE" ] || { echo "missing $KEY_FILE" >&2; exit 1; }
KEY="$(cat "$KEY_FILE")"

# human status name -> statusId (POST/PATCH) ; and -> TYPE (GET filter)
status_id() {
  case "$1" in
    backlog)    echo "cmge9i3pt0005walququqw1rx" ;;
    todo)       echo "cmge9i3pv0007walqv7is970v" ;;
    inprogress|in-progress|start) echo "cmge9i3pv0009walqbwhmule6" ;;
    done)       echo "cmge9i3pw000bwalqn1glwrn4" ;;
    canceled|cancelled) echo "cmge9i3pw000dwalqi5qgpguo" ;;
    *) echo "" ;;
  esac
}
status_type() {
  case "$1" in
    backlog) echo "BACKLOG" ;; todo) echo "TODO" ;;
    inprogress|in-progress) echo "IN_PROGRESS" ;; done) echo "DONE" ;;
    canceled|cancelled) echo "CANCELED" ;; *) echo "" ;;
  esac
}

api() { # method path [curl-args...]
  local method="$1" path="$2"; shift 2
  curl -s -X "$method" "$BASE$path" \
    -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" "$@"
}

# id -> nome dos milestones, em JSON. A API devolve só `milestoneId` nas issues,
# nenhum objeto `milestone` aninhado, então resolvemos o nome aqui.
_ms_json() {
  api GET "/api/milestones?projectId=$PROJECT_ID" | python3 -c "
import sys,json
d=json.load(sys.stdin)
items=d if isinstance(d,list) else d.get('milestones',d.get('data',[]))
print(json.dumps({m.get('id'): m.get('name') for m in items}))
"
}

# print "id | status | title [milestone]" rows from an issues-list JSON on stdin; optional keyword $1
_print_rows() {
  PM_MS="$(_ms_json)" python3 -c "
import sys,json,os
kw=(sys.argv[1] if len(sys.argv)>1 else '').lower()
nomes=json.loads(os.environ.get('PM_MS') or '{}')
d=json.load(sys.stdin)
items=d if isinstance(d,list) else d.get('issues',d.get('data',[]))
for it in items:
    t=it.get('title','') or ''
    if kw and kw not in t.lower(): continue
    st=it.get('status',{}); stn=st.get('name') if isinstance(st,dict) else st
    nome=nomes.get(it.get('milestoneId'))
    tag=f\" [{nome}]\" if nome else ''
    print(f\"{it.get('id')} | {stn} | {t}{tag}\")
" "${1:-}"
}

cmd="${1:-}"; shift || true
case "$cmd" in
  list)
    q="projectId=$PROJECT_ID"
    if [ "${1:-}" != "" ]; then t="$(status_type "$1")"; [ -n "$t" ] && q="$q&status=$t"; fi
    api GET "/api/issues?$q" | _print_rows
    ;;
  find)
    [ "${1:-}" != "" ] || { echo "usage: pm.sh find <keyword>" >&2; exit 1; }
    api GET "/api/issues?projectId=$PROJECT_ID" | _print_rows "$1"
    ;;
  get)
    [ "${1:-}" != "" ] || { echo "usage: pm.sh get <issueId>" >&2; exit 1; }
    api GET "/api/issues/$1" | PM_MS="$(_ms_json)" python3 -c "
import sys,json,os
it=json.load(sys.stdin)
nomes=json.loads(os.environ.get('PM_MS') or '{}')
st=it.get('status',{}); stn=st.get('name') if isinstance(st,dict) else st
print(it.get('id'),'|',stn,'|',it.get('title'))
print('milestone:', nomes.get(it.get('milestoneId')) or '(none)')
print('---')
print(it.get('description') or '(no description)')
"
    ;;
  status|done|start)
    if [ "$cmd" = "done" ]; then id="${1:-}"; name="done"
    elif [ "$cmd" = "start" ]; then id="${1:-}"; name="inprogress"
    else id="${1:-}"; name="${2:-}"; fi
    [ -n "$id" ] && [ -n "$name" ] || { echo "usage: pm.sh status <issueId> <name> | done <id> | start <id>" >&2; exit 1; }
    sid="$(status_id "$name")"; [ -n "$sid" ] || { echo "unknown status: $name" >&2; exit 1; }
    code="$(api PATCH "/api/issues/$id" -d "{\"statusId\":\"$sid\"}" -o /dev/null -w '%{http_code}')"
    echo "$id -> $name: HTTP $code"
    ;;
  create)
    title="${1:-}"; shift || true
    [ -n "$title" ] || { echo "usage: pm.sh create <title> [--desc .. | --desc-file F] [--status N] [--type T] [--priority P] [--milestone ID]" >&2; exit 1; }
    desc=""; statusname="todo"; type="IMPROVEMENT"; priority="MEDIUM"; milestone=""
    while [ "${1:-}" != "" ]; do
      case "$1" in
        --desc) desc="$2"; shift 2 ;;
        --desc-file) desc="$(cat "$2")"; shift 2 ;;
        --status) statusname="$2"; shift 2 ;;
        --type) type="$2"; shift 2 ;;
        --priority) priority="$2"; shift 2 ;;
        --milestone) milestone="$2"; shift 2 ;;
        *) echo "unknown option: $1" >&2; exit 1 ;;
      esac
    done
    sid="$(status_id "$statusname")"; [ -n "$sid" ] || { echo "unknown status: $statusname" >&2; exit 1; }
    body="$(python3 -c "
import json,sys
b={
  'title': sys.argv[1], 'description': sys.argv[2],
  'workspaceId': sys.argv[3], 'projectId': sys.argv[4],
  'statusId': sys.argv[5], 'type': sys.argv[6], 'priority': sys.argv[7],
}
if sys.argv[8]: b['milestoneId']=sys.argv[8]
print(json.dumps(b))" "$title" "$desc" "$WORKSPACE_ID" "$PROJECT_ID" "$sid" "$type" "$priority" "$milestone")"
    api POST "/api/issues" -d "$body" | python3 -c "
import sys,json
d=json.load(sys.stdin)
st=d.get('status',{}); stn=st.get('name') if isinstance(st,dict) else st
print('created:', d.get('id'),'|',stn,'|',d.get('title'))
"
    ;;
  desc)
    id="${1:-}"; shift || true
    [ -n "$id" ] || { echo "usage: pm.sh desc <issueId> [--desc .. | --desc-file F] [--append]" >&2; exit 1; }
    desc=""; append=0
    while [ "${1:-}" != "" ]; do
      case "$1" in
        --desc) desc="$2"; shift 2 ;;
        --desc-file) desc="$(cat "$2")"; shift 2 ;;
        --append) append=1; shift ;;
        *) echo "unknown option: $1" >&2; exit 1 ;;
      esac
    done
    # --append keeps the existing description and adds the new text below it (a blank line
    # between), which is how a refinement note is added without clobbering the original scope.
    if [ "$append" = "1" ]; then
      cur="$(api GET "/api/issues/$id" | python3 -c "import sys,json; print(json.load(sys.stdin).get('description') or '')")"
      [ -n "$cur" ] && desc="$cur

$desc"
    fi
    body="$(python3 -c "import json,sys; print(json.dumps({'description': sys.argv[1]}))" "$desc")"
    code="$(api PATCH "/api/issues/$id" -d "$body" -o /dev/null -w '%{http_code}')"
    echo "$id -> desc updated: HTTP $code"
    ;;
  ms)
    sub="${1:-}"; shift || true
    case "$sub" in
      list)
        api GET "/api/milestones?projectId=$PROJECT_ID" | python3 -c "
import sys,json
d=json.load(sys.stdin)
items=d if isinstance(d,list) else d.get('milestones',d.get('data',[]))
for m in items:
    print(f\"{m.get('id')} | {m.get('name')} | {(m.get('targetDate') or '')[:10] or '(sem alvo)'}\")
"
        ;;
      create)
        name="${1:-}"; shift || true
        [ -n "$name" ] || { echo "usage: pm.sh ms create <nome> [--target YYYY-MM-DD] [--desc ..]" >&2; exit 1; }
        target=""; desc=""
        while [ "${1:-}" != "" ]; do
          case "$1" in
            --target) target="$2"; shift 2 ;;
            --desc) desc="$2"; shift 2 ;;
            *) echo "unknown option: $1" >&2; exit 1 ;;
          esac
        done
        body="$(python3 -c "
import json,sys
b={'name': sys.argv[1], 'projectId': sys.argv[2]}
if sys.argv[3]: b['targetDate']=sys.argv[3]+'T00:00:00.000Z'
if sys.argv[4]: b['description']=sys.argv[4]
print(json.dumps(b))" "$name" "$PROJECT_ID" "$target" "$desc")"
        api POST "/api/milestones" -d "$body" | python3 -c "
import sys,json
d=json.load(sys.stdin)
print('created:', d.get('id'),'|',d.get('name'),'|',(d.get('targetDate') or '')[:10] or '(sem alvo)')
"
        ;;
      set)
        id="${1:-}"; ms="${2:-}"
        [ -n "$id" ] && [ -n "$ms" ] || { echo "usage: pm.sh ms set <issueId> <milestoneId|none>" >&2; exit 1; }
        if [ "$ms" = "none" ]; then body='{"milestoneId":null}'; else body="{\"milestoneId\":\"$ms\"}"; fi
        code="$(api PATCH "/api/issues/$id" -d "$body" -o /dev/null -w '%{http_code}')"
        echo "$id -> milestone $ms: HTTP $code"
        ;;
      *) echo "usage: pm.sh ms list | ms create <nome> [--target YYYY-MM-DD] | ms set <issueId> <milestoneId|none>" >&2; exit 1 ;;
    esac
    ;;
  ""|-h|--help|help)
    sed -n '2,30p' "$0"
    ;;
  *) echo "unknown command: $cmd (try: pm.sh help)" >&2; exit 1 ;;
esac
