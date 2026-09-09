# Animação da marca

Projeto em etapas (Fase 4 no board). O pinguim caminha até o letreiro e encaixa
o G azul no lugar; alguns flocos de neve caem. Termina exatamente na pose do
logo.

## Etapa 1 — Rig do pinguim ✔

`src/components/pinguim-rig.tsx` · `public/marca/elementos/pinguim-rig.svg`

A silhueta única virou oito partes, cada uma num `<g data-parte>` com pivô na
junta real:

| Parte | Mãe | Pivô (x, y) |
| --- | --- | --- |
| `cabeca` | tronco | 288, 468 |
| `nadadeira-frente` (erguida, toca o G) | tronco | 353, 525 |
| `nadadeira-tras` (a crescente) | tronco | 334, 667 |
| `perna-frente` (grossa) | tronco | 246, 684 |
| `pe` | perna-frente | 248, 805 |
| `perna-tras` (o traço fino) | pé | 296, 818 |
| `tronco` | — | 265, 700 |
| `gelo` | — | estático |

**Como foi feito.** Segmentação por crescimento a partir de sementes dentro da
tinta: cada pixel fica com a semente mais próxima por dentro da silhueta, e as
fronteiras caem sozinhas nos pontos estreitos — que são as juntas. Depois, cada
filha invade de 11 a 15 px a mãe (só dentro da tinta) e a mãe é desenhada por
cima: quando a filha gira, a emenda fica escondida. O pivô é o centro dos
pixels de contato entre filha e mãe — calculado, não medido a olho.

**Prova.** A união das oito partes é bit a bit igual ao pinguim original. Em
render a 420 px, o rig em repouso difere do original em 0,1% dos pixels
(antialiasing de borda). Articulado a ±14°, as juntas não abrem.

**Regras para animar.** `transform` só no `<g data-parte>`; o `<g transform>`
interno carrega a escala negativa em Y do vetorizador e colapsa se for tocado.
Amplitudes acima de ~12° nas pernas começam a mostrar um micro-degrau no
quadril — sub-pixel aos 112 px, mas o gingado não precisa de tanto.

## Etapa 2 — Ciclo de caminhada ✔

`src/lib/gingado.ts` — motor paramétrico. Cada parte é uma função do tempo:
queda rápida no contato com baque de 1,5px, subida lenta até o ápice, squash
de 1,5%, cabeça com 8% de atraso e aceno no contato, nadadeiras com 12% de
atraso e overshoot. O envelope de chegada leva a amplitude a zero e sobe a
nadadeira para a pose do logo. O bloco de gelo faz parte do osso-raiz: na
silhueta ele lê como pé, e fixo no destino parecia pé faltando.

## Etapa 3 — Coreografia ✔ (em revisão)

`src/components/marca-animada.tsx` — GSAP orquestra; o gingado roda por
dentro. O laboratório em `/animacao` tem pause (botão ou espaço), scrub e
`?p=0.42` para congelar num ponto exato — é assim que os quadros são capturados.

**O G teve que ser separado de novo.** Na vetorização, o contorno era "tinta
escura a até 9px do azul", e isso engolia a ponta da nadadeira onde ela encosta
no G: parado, invisível; em voo, o G levava um pedaço de pinguim junto, e o
pinguim ficava com a nadadeira truncada. Refeito por crescimento a partir de
sementes, com o anel do G e as partes do pinguim competindo pelos mesmos
pixels. Três correções derivadas:

- onde a nadadeira cobre a borda do G, o anel foi reconstruído por baixo (tinta
  sobre tinta, como na impressão) — os pixels pertencem aos dois;
- uma ilha de azul deslocado que sobrevivia sob a nadadeira foi removida: o G é
  só o componente principal do azul;
- no canto inferior esquerdo, onde a impressão ficou suja, o anel é uma faixa
  uniforme de 9px acompanhando a curva.

**O G pendia 1,07° para a esquerda** — medido em três bordas da haste, com a
linha de base das palavras a ~0° como referência. Mão do desenhista original.
Foi endireitado nas máscaras (haste a +0,02° depois), e a coreografia usa isso
como gesto: o G desce torto, balança sem se endireitar sozinho, e é o toque da
nadadeira que o põe no prumo — passa 0,5° e assenta a 0°.

A marca estática mudou só nisso e na ilha de azul removida, tudo correção de
registro e de prumo.

**Os brancos do pinguim são buracos.** Olho, vão do bico e barriga são papel
aparecendo. Parado, tanto faz; em movimento, o cenário aparece por dentro dele
quando passa na frente dos icebergs. Cada parte ganhou um **miolo** cor de papel
(`--marca-papel`) desenhado por baixo da tinta. A barriga ainda é cercada por
três partes (tronco e as duas nadadeiras), e o contorno rachava quando elas se
mexiam: o tronco ganhou um anel de 9px em volta dela — como é desenhado por
cima, a linha fica inteira e a barriga segue orgânica.

**A linha fina é a ponta do braço.** No original ela flutua 10px abaixo do
braço crescente — traço do desenhista, sem tinta no vão nem antes do filtro. Lida
como desconexão, e em movimento vira mesmo. No rig ela ganhou uma ponte de tinta
com a largura da própria linha, nasce no braço, gira no topo e chicoteia atrás
dele com atraso (`pontaGanho`, `pontaAtraso`). O id passou de `perna-tras` para
`nadadeira-tras-ponta`. A marca estática mantém o vão original; a ponte existe
só no rig — a 112 px é 1 px de diferença.

**Papel por baixo do corpo inteiro.** Além dos miolos de olho, bico e barriga,
o corpo tem uma camada cor de papel do tamanho da silhueta (`data-parte="papel"`),
desenhada antes de tudo. Nada do cenário atravessa o pinguim, e onde uma parte
sai do lugar aparece papel, não iceberg. Só cabeça e tronco carregam miolo
próprio; o resto é coberto por essa camada.

**A base da linha fina entra no pé.** No original ela termina em y=820 e o pé
começa em y=821: um pixel de encosto, zero de sobreposição. Balançando pelo topo,
a base varria ±20px e se descolava do pé. Agora ela entra 30px dentro do pé, que
é desenhado por cima — o que entra some, e o balanço nunca abre vão.

**O braço crescente é uma cadeia de três.** A ponta dele era um floco solto de
79 px no original (falha de tinta), soldado no rig com 41 px de ponte. Para a
"onda leve" do corpo, o braço foi dividido em base, meio e fim (cortes por x ao
longo do arco, pivôs pelo contato) e cada elo repete o anterior com atraso de 5%
do ciclo e ganho de 0,8 (`ondaAtraso`, `ondaGanho`). A onda corre da base para a
ponta — como um corpo que se mexe, não uma peça girando.

## Etapas seguintes

4. Neve e vida ociosa · 5. Integração · 6. Polimento
