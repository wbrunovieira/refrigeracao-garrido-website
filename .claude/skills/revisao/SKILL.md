---
name: revisao
description: Como funciona o painel /revisao do site da Refrigeração Garrido — registrar pedidos que chegam pelo WhatsApp, responder "já ajustei", ler as filas e testar sem sujar o registro. Use sempre que a cliente mandar um pedido, quando terminar de implementar algo que ela pediu, ou antes de mexer em src/content/revisao.ts, src/lib/revisao.ts ou src/app/api/revisao.
---

# O painel `/revisao`

Ferramenta de aprovação entre a **WB Digital Solutions** (agência) e a **Refrigeração Garrido**
(cliente). O site é uma página só, então a cliente aprova **seção por seção**, na ordem em que
elas aparecem rolando — do cabeçalho ao rodapé — mais o botão flutuante, os dados da loja e a
página provisória do domínio. Tudo fica gravado com data, hora, autor e IP.

`https://preview.refrigeracaogarrido.com.br/revisao` — sem login, o endereço é o acesso.

É o mesmo painel do projeto Dark Film (`~/projects/darkfilm-website`), com o `PainelRevisao.tsx`
reescrito para seções em vez de páginas. Modelo de eventos, API, Blob e script são iguais.

## A regra que resolve 90% dos casos

**Implementar o pedido e responder no painel são duas coisas diferentes, e é a segunda que a
cliente vê.** Ao fim de toda rodada, confira que a fila da agência está vazia:

```bash
curl -s https://preview.refrigeracaogarrido.com.br/api/revisao | python3 -c "
import sys,json
ev=json.load(sys.stdin); ev=ev.get('eventos',ev)
LADO={'Refrigeração Garrido':'cliente','Bruno WB Digital Solutions':'agencia'}
def sit(e):
    outro='com-agencia' if LADO[e['autor']]=='cliente' else 'com-cliente'
    return {'confirmado':'fechado','aprovado':'aprovado','ajustado':'com-cliente','desfeito':'com-cliente'}.get(e['acao'],outro)
m={}
for e in sorted(ev,key=lambda x:x['em']):
    if e.get('secaoId'): m[f\"{e['paginaId']}/{e['secaoId']}\"]=sit(e)
print('precisa de nós:', [k for k,v in m.items() if v=='com-agencia'] or 'nada')"
```

## O fluxo normal

A cliente manda pelo WhatsApp — é o canal dela. O combinado:

1. **Transcrever** o pedido no painel, com a data real em que ela mandou
2. **Implementar** (e abrir a issue no board, como sempre — skill `track-work`)
3. **Registrar o "já ajustei"**, dizendo o que mudou e o que ficou diferente do pedido
4. Ela só precisa **aprovar**

Passos 1 e 3 usam o script, nunca a API pública.

## Registrar (o script)

```bash
node --env-file=.env.local scripts/importar-revisao.mjs --listar     # ids das seções

node --env-file=.env.local scripts/importar-revisao.mjs \
  --pagina site --secao galeria --acao alteracao \
  --autor "Refrigeração Garrido" --data 2026-09-20 \
  --texto "Tirar a foto do corredor, está antiga."

node --env-file=.env.local scripts/importar-revisao.mjs --lote /tmp/lote.json
```

`lote.json`: lista de `{ "pagina": "site", "secao": "<id>", "acao": "...", "autor": "...",
"texto": "...", "data": "AAAA-MM-DD" (opcional), "origem": "whatsapp" | "interno" }`.

`--env-file=.env.local` é obrigatório (o token do Blob está lá — `vercel env pull` se faltar).
A página é sempre `site`; o item "o site como um todo" é a seção `__pagina`.

### Por que não pela API pública

A API carimba **sempre** o agora e o IP de quem clicou, de propósito. Importação é ato de
bastidor: no lugar do IP vai `WhatsApp` ou `Registro interno`, e o evento nunca finge ter vindo
do painel.

## O modelo

**Autores** (strings exatas): `Refrigeração Garrido` (cliente) · `Bruno WB Digital Solutions`
(agência). Quando o nome da dona for confirmado, **adicione** um autor em `src/lib/revisao.ts`,
`scripts/importar-revisao.mjs` e no cheque acima — nunca renomeie o existente.

| Ação | Quem usa | Depois fica |
| --- | --- | --- |
| `alteracao` | cliente pede mudança | com a agência |
| `resposta` | qualquer lado responde | com o outro lado |
| `criado` | abre assunto avulso | com o outro lado |
| `ajustado` | agência diz "já fiz" | **com o cliente** |
| `aprovado` | cliente aprova | aprovado |
| `desfeito` | cliente desfaz a aprovação | com o cliente |
| `confirmado` | agência agradece e fecha | fechado |

Estado de cada item = **último evento vence**.

Aprovar "o site como um todo" (secaoId `null` na API) grava **um evento por seção, mais o
`__pagina`** — não um evento coletivo.

## Onde está cada coisa

| Arquivo | O quê |
| --- | --- |
| `src/content/revisao.ts` | as 13 seções (ids + títulos) e `DETALHE` (âncora + o que olhar) |
| `src/lib/revisao.ts` | tipos, `LADO`, `situacaoApos`, `reduzir`, leitura/escrita no Blob |
| `src/app/api/revisao/route.ts` | POST do painel; carimba IP e agora |
| `src/components/revisao/` | `PainelRevisao.tsx` (seções como cartões), `ui.tsx`, `Conversa.tsx` |
| `scripts/importar-revisao.mjs` | registro de bastidor |
| Blob privado `revisao-garrido` | `revisao/eventos/<id>.json`, um arquivo por evento |

### Duas regras de ouro

**Nunca renomeie um `id` de seção em uso.** O histórico está amarrado a ele. `titulo` e `nota`
são livres.

**Nunca escreva "você" nos rótulos.** O painel tem seletor de autor; nomeie os lados:
`Esperando a Garrido` e `Esperando a WB`.

## O registro é append-only de verdade

O `put` do Blob recusa sobrescrever. Corrigir uma mensagem publicada é gesto excepcional e exige
perguntar ao Bruno antes. Melhor: reler antes de gravar.

## Testar sem sujar o registro

Testar no ar escreve no Blob de produção. Grave um evento, **apague pelo id** (nunca `--zerar`),
confira que o total voltou ao original:

```bash
node --env-file=.env.local -e "import('@vercel/blob').then(async({del,list})=>{await del(['revisao/eventos/<id>.json']);console.log((await list({prefix:'revisao/eventos/'})).blobs.length)})"
```

## Escrevendo para a cliente

Ela lê no celular, no balcão, entre um cliente e outro. Diga o que mudou e quanto ("a galeria
passou de 13 para 9 fotos"), admita o que ficou diferente do pedido e por quê, peça o que falta
com o motivo, sem jargão ("endereço provisório", não "subdomínio de staging"). Releia procurando
contradição.

## Deploy

Mudança em código exige `vercel --prod --yes --scope brunoteam`. Evento gravado pelo script
aparece na hora, sem deploy.
