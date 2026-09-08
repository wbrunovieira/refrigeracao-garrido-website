---
name: track-work
description: Rastreia todo trabalho do Refrigeração Garrido Website (features, correções, melhorias, débito técnico) como issues e milestones no WB Project Manager via a API, e mantém o status atualizado. Use SEMPRE ao planejar/iniciar trabalho não-trivial, ao descobrir um bug/melhoria, ao começar (→ In Progress) e ao concluir (→ Done). Também ao pedir "cria as issues", "cria o milestone", "atualiza o board".
---

# track-work — rastrear o Refrigeração Garrido Website como issues e milestones

Todo trabalho não-trivial vira issue no projeto **Refrigeração Garrido Website**
do WB Project Manager, agrupado em milestones, com status em dia. Não rastreie
trivialidades (typo, ajuste de uma linha).

## Use o CLI `pm.sh` (não remonte curl na mão)

```bash
PM=.claude/skills/track-work/pm.sh

# Issues
$PM find contato                # SEMPRE antes de criar — evita duplicata
$PM list todo                   # backlog|todo|inprogress|done|canceled
$PM get <issueId>
$PM start <issueId>             # -> In Progress
$PM done <issueId>              # -> Done (o app calcula o SLA sozinho)
$PM status <issueId> canceled
$PM create "Título" --status todo --priority HIGH --milestone <msId> --desc-file /tmp/d.txt

# Milestones
$PM ms list
$PM ms create "Fase 1 — Site institucional" --target 2026-10-31
$PM ms set <issueId> <milestoneId>    # 'none' desvincula
```

Descrições longas: escreva num arquivo e passe `--desc-file` (evita aspas/escape no shell).

## Como organizar

Milestone = fase ou entrega (algo com data e fim). Issue = uma ação entregável.
Ao planejar: crie o milestone primeiro, depois as issues já com `--milestone`.

## Constantes

- Base URL: `https://projects.wbdigitalsolutions.com`
- projectId: `cmtstixt000o5s501zmcy0rvp` | workspaceId: `cmge96f200001wa7ouziczg0w`
- API key: `~/.wb-project-manager-api-key` — NUNCA ecoar; ler via `$(cat ...)`.

| Status      | statusId (POST/PATCH)      | type (filtro GET) |
| ----------- | -------------------------- | ----------------- |
| Backlog     | `cmge9i3pt0005walququqw1rx` | `BACKLOG`         |
| Todo        | `cmge9i3pv0007walqv7is970v` | `TODO`            |
| In Progress | `cmge9i3pv0009walqbwhmule6` | `IN_PROGRESS`     |
| Done        | `cmge9i3pw000bwalqn1glwrn4` | `DONE`            |
| Canceled    | `cmge9i3pw000dwalqi5qgpguo` | `CANCELED`        |

Enums: `priority` = URGENT|HIGH|MEDIUM|LOW|NO_PRIORITY · `type` = FEATURE|MAINTENANCE|BUG|IMPROVEMENT

## Comandos crus (o que o pm.sh não cobre: bulk)

```bash
KEY=$(cat ~/.wb-project-manager-api-key)
BASE=https://projects.wbdigitalsolutions.com

# Lote de issues — até 100 por request
curl -s -X POST "$BASE/api/issues/bulk" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"workspaceId":"cmge96f200001wa7ouziczg0w","issues":[
        {"title":"...","description":"...","projectId":"cmtstixt000o5s501zmcy0rvp","statusId":"cmge9i3pv0007walqv7is970v","type":"FEATURE","priority":"HIGH"}
      ]}'
```

Doc completa das rotas: `/api/docs` (Swagger UI — Authorize 🔓, cola a key, "Try it out").
Spec OpenAPI 3.1: `openapi.yaml` / `GET /api/openapi`.

## Gotchas

- No GET o filtro é `status=<TYPE>` (ex.: `status=IN_PROGRESS`); no POST/PATCH é
  `statusId=<cuid>`. São diferentes.
- Datas em ISO 8601; `milestoneId`/`assigneeId` aceitam `null`. Bulk máx 100.
- As issues devolvem `milestoneId` (cuid), NUNCA um objeto `milestone` aninhado. Para mostrar
  o nome da fase é preciso buscar `/api/milestones` e resolver o id — o `pm.sh` já faz isso.
  Se algo imprimir `milestone: (none)` com o id preenchido, é bug do leitor, não vínculo perdido.
- `identifier` é só um número sequencial do workspace (ex.: `1657`), não uma chave tipo `ABC-12`.
- Obrigatórios ao criar issue: `title`, `workspaceId`, `statusId`. No POST single
  (`/api/issues`) o `workspaceId` vai no CORPO (não só no bulk) — sem ele = 400 Invalid input.
- Milestone exige `name` + `projectId`; `targetDate` é opcional e vai em ISO 8601.
- Key errada → 401; não parseie o corpo do 401, confie no status.
- `/api/generate-token` foi REMOVIDO — só API key, não existe token de sessão.
- Use `curl`, não urllib/requests com UA padrão. Um WAF barra o user-agent do Python urllib
  com 403 mesmo com a key correta. 403 aí é bloqueio de UA, não permissão. Se precisar de
  Python, monte o JSON com Python e faça a chamada com curl.
- Se um comando "não fez nada": quase sempre é prompt de permissão do Bash negado na sua sessão
  (o curl nem rodou), não erro da API. Use `-w "\nHTTP %{http_code}\n"` para confirmar.
- Key nova é tarefa de admin: `openssl rand -hex 32` → setar `API_KEY` e `API_KEY_USER_ID`
  (obrigatório) no servidor → redeploy.
