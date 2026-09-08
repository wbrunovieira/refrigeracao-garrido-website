# Marca da Refrigeração Garrido

Vetorização do logo a partir da foto do cartão de visita
(`cartao-visita.jpg`, foto do Bruno). Não havia arte original digital.

## O logo

Um **G** compartilhado por REFRI**G**ERAÇÃO e **G**ARRIDO, com um **pinguim**
apoiado nele, em pé sobre um bloco de gelo, diante de icebergs e água.

## Arquivos em `public/marca/`

| Arquivo | Contém | Uso |
| --- | --- | --- |
| `garrido-marca-completa.svg` | tudo | assinatura principal, fundo claro |
| `garrido-marca-completa-mono.svg` | tudo, em `currentColor` | fundo escuro do site |
| `garrido-logotipo.svg` | tipografia + G, sem pinguim nem cena | cabeçalho, linhas estreitas |
| `garrido-logotipo-mono.svg` | idem, em `currentColor` | fundo escuro |
| `garrido-simbolo.svg` | pinguim + G | ícone, avatar, favicon |
| `garrido-simbolo-mono.svg` | idem, em `currentColor` | fundo escuro |

Cada arquivo é dividido em grupos nomeados, para dar pra mexer em uma parte só:

```
agua · icebergs · letra-g · contorno-g · pinguim
palavra-refrigeracao · palavra-garrido
```

Nos arquivos `-mono` tudo herda `currentColor`; `icebergs`, `agua` e
`contorno-g` recuam com `opacity=".42"` para o G e o pinguim continuarem sendo
o foco. Como usam `currentColor`, precisam ser embutidos no HTML (inline) para
receber a cor — via `<img>` saem pretos.

## Onde a marca entra no site

| Lugar | O que usa |
| --- | --- |
| Cabeçalho | marca completa, cores do cartão — a **barra inteira é creme**, sem placa |
| Rodapé | marca completa sobre placa creme, porque o rodapé é verde |
| Favicon (`src/app/icon.svg`) | símbolo (pinguim + G) nas cores do cartão, sobre creme |

**A marca nunca é recolorida.** Ela aparece sempre em azul e grafite, como no
cartão. Ela foi desenhada para papel claro e só funciona sobre creme — então
quem se adapta é o layout.

No topo, a **barra inteira** é creme (`#FBF6EA`), com peitoril de 1px em
`--verde-800` e sombra ao rolar. É a fachada: letreiro claro de ponta a ponta
apoiado na loja verde. Uma placa solta ali lia como adesivo. No rodapé, que é
verde, a marca volta a precisar de placa.

Por isso as seções claras usam `--creme-2` e não `--creme`: sem essa diferença
o cabeçalho desaparece ao passar por elas.

O azul do logo tem um eco na interface, em dose única: os rótulos das seções
claras usam `--azul-marca #3F6B88` (o azul escurecido para ter contraste).
Não entra em botão nem link — ali brigaria com o ouro, que é a cor de ação.

O componente aceita `mono`, que faz a marca inteira herdar `currentColor`. Existe
para casos de exceção (marca d'água, impressão em uma cor só) — não para
encaixar a marca numa paleta.

**A barra do topo tem 112px por causa da marca.** Abaixo de ~88px de altura as
duas palavras deixam de ser legíveis — medido, não estimado. Quem for encolher o
cabeçalho precisa trocar para `garrido-logotipo`, que dispensa a cena de gelo e
aguenta 56px.

Como os arquivos `-mono` dependem de `currentColor`, são embutidos via
`src/components/marca-svg.tsx`, gerado a partir de `public/marca/*-mono.svg`.
Lá os grupos viram `data-parte` em vez de `id`: cabeçalho e rodapé desenham a
marca na mesma página e ids repetidos seriam HTML inválido.

## Cores

| | Hex | O que é |
| --- | --- | --- |
| Azul Garrido | `#5B87A6` | G, icebergs, água |
| Grafite Garrido | `#2E302C` | pinguim, letras, contorno do G |

**São aproximações.** Vieram de uma foto de celular, com correção de branco
pelo papel do cartão. Se a cliente tiver a arte original ou souber as cores de
impressão, trocar — e é só editar `--marca-gelo` e `--marca-tinta` em
`src/components/marca-svg.tsx`.

## Como foi vetorizado

1. HEIC → PNG, cartão girado e endireitado. O ângulo NÃO é chute: mede-se a
   linha de base das letras (centro-x, base-y de cada componente, ajuste linear
   robusto com descarte de outliers) e corrige-se por ele. Aqui deu +0,354°,
   deixando as duas palavras em −0,11° e +0,19° — abaixo do perceptível.
2. As duas tintas separadas por **cor**, não por brilho: azul onde `B−R > 12`;
   grafite onde `L < 132` e `B−R ≤ 12`. Filtro de mediana (5) tira o granulado
   do papel sem comer o traço.
3. Componentes conexos rotulados e agrupados nas sete partes acima. O pinguim
   e o contorno do G saem grudados na foto (a nadadeira encosta no G) — a
   separação usa o preenchimento azul como semente e dilata 9px para isolar só
   o anel escuro em volta.
4. `potrace -a 1.0 -O 0.2 -t 10 -u 10 --flat` em cada parte.
5. **Correção de registro do G.** No cartão o azul foi impresso deslocado para a
   esquerda e para baixo, e escapa do contorno preto — é falha de registro da
   impressão, não desenho. O azul é recortado ao interior do contorno
   (`fill_holes` do anel escuro somado ao pinguim, que cobre parte do anel e sem
   o qual o buraco não fecha). Foram 3.334 px de 37.886 removidos.
6. Montagem dos SVGs com `viewBox` apertado no conteúdo de cada variante.

Refazer com outra foto: os scripts do processo estão descritos aqui passo a
passo; os pontos sensíveis são o passo 1, que precisa ser medido e não estimado, e
os limiares do passo 2, que dependem da iluminação.
