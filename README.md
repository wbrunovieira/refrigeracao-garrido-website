# Refrigeração Garrido — Website

Site institucional da **Refrigeração Garrido**, loja de peças, equipamentos e
assistência técnica em refrigeração no Centro de Petrópolis (RJ) desde 1971.

Página única, estática, em português, com foco em uma coisa: fazer quem chega
falar com a loja no WhatsApp ou aparecer no balcão.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS 4 com tokens amostrados da própria fachada da loja
- Sem dependências de UI: ícones, animações e componentes são do projeto

## Design

A identidade sai do letreiro: o verde do toldo, o amarelo das letras e o creme
da placa. A tipografia usa Bricolage Grotesque no display, Instrument Sans no
corpo e Space Mono nos rótulos — a mono imita as etiquetas amarelas coladas nas
caixas de peça da prateleira.

O elemento central é **o balcão**: sete "gavetas" de categoria onde o visitante
marca o que procura e a pergunta vai pronta pelo WhatsApp. Não é loja online —
o site não vende; quem responde é a loja.

## Seções

| Seção | Conteúdo |
| --- | --- |
| Herói | Proposta, fachada, telefones do letreiro e status de aberto/fechado ao vivo |
| Prateleira | Marcas e tipos de peça em movimento |
| O balcão | Sete gavetas de produto; o visitante marca o que procura e a pergunta vai pronta para o WhatsApp — não é compra |
| Assistência | Seis frentes de conserto e instalação |
| História | 55 anos, equipe e o texto da própria loja |
| Depoimentos | Avaliações públicas e nota do Google |
| Galeria | Fotos reais do estoque e da loja |
| Visite | Endereço, horário completo, contatos e mapa |

## Desenvolvimento

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
pnpm lint
```

## Antes de publicar

Os dados vieram do perfil `@refrigeracaogarrido`, da fachada e de listas
públicas. Confirmar com a cliente:

- [ ] Telefones, WhatsApp e horários (`src/lib/negocio.ts`)
- [ ] Lista de serviços de assistência técnica (`src/lib/catalogo.ts`)
- [ ] Itens de cada gaveta e marcas trabalhadas
- [ ] Substituir os depoimentos pelas avaliações reais do Google
- [ ] Domínio definitivo (hoje `refrigeracaogarrido.com.br` nos metadados)

## Estrutura

```
src/app/          layout, metadados, JSON-LD, robots e sitemap
src/components/   seções da página e o conjunto de ícones
src/lib/          dados do negócio e catálogo
public/fotos/     fotos da loja, otimizadas em WebP
```
