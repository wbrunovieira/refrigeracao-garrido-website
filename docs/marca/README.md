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

## Cores

| | Hex | O que é |
| --- | --- | --- |
| Azul Garrido | `#5B87A6` | G, icebergs, água |
| Grafite Garrido | `#2E302C` | pinguim, letras, contorno do G |

**São aproximações.** Vieram de uma foto de celular, com correção de branco
pelo papel do cartão. Se a cliente tiver a arte original ou souber as cores de
impressão, trocar.

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
5. Montagem dos SVGs com `viewBox` apertado no conteúdo de cada variante.

Refazer com outra foto: os scripts do processo estão descritos aqui passo a
passo; os pontos sensíveis são o passo 1, que precisa ser medido e não estimado, e
os limiares do passo 2, que dependem da iluminação.
