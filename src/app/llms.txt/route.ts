import { gavetas, marcas, servicos } from "@/lib/catalogo";
import { anosDeCasa, horaLegivel, horarios, negocio } from "@/lib/negocio";

/**
 * /llms.txt — o site explicado para assistentes de IA.
 *
 * Quem procura "peça de geladeira em Petrópolis" hoje pergunta tanto ao Google
 * quanto ao ChatGPT, e o que esses assistentes respondem sai do que conseguem
 * ler. A página é uma só e cheia de interação; este arquivo entrega o mesmo
 * conteúdo em texto limpo: o que a loja é, onde fica, quando abre, o que vende
 * e o que conserta.
 *
 * É gerado das mesmas fontes do site (negocio.ts e catalogo.ts). Nada é
 * digitado duas vezes: corrigir o horário num lugar corrige aqui também.
 */
export const revalidate = 86400;

export function GET() {
  const site = "https://refrigeracaogarrido.com.br";
  const { endereco: e } = negocio;

  const expediente = horarios.map((h) =>
    h.abre == null
      ? `- ${h.rotulo}: fechado`
      : `- ${h.rotulo}: ${horaLegivel(h.abre)} às ${horaLegivel(h.fecha!)}`,
  );

  const texto = `# ${negocio.nome}

> Loja de peças de reposição, equipamentos de refrigeração e assistência técnica no Centro de ${e.cidade}, no Rio de Janeiro. Aberta desde ${negocio.fundacao} — são ${anosDeCasa()} anos no mesmo endereço.

A loja atende quem tem um aparelho quebrado em casa (geladeira, freezer, máquina de lavar, secadora, lava e seca) e quem depende de refrigeração para trabalhar (bar, padaria, mercado, restaurante). Vende a peça no balcão e também faz o conserto.

## Contato

- Site: ${site}
- WhatsApp: ${negocio.whatsapp.numero} (https://wa.me/${negocio.whatsapp.e164})
- Telefones: ${negocio.telefones.map((t) => t.numero).join(" e ")}
- E-mail: ${negocio.email}
- Instagram: ${negocio.instagram.url}
- Mapa: ${negocio.mapa}

## Endereço

${e.rua} — ${e.bairro}, ${e.cidade}/${e.uf}, CEP ${e.cep}.
Coordenadas: ${e.lat}, ${e.lng}.

## Horário de funcionamento

${expediente.join("\n")}

## O que a loja vende

${gavetas.map((g) => `### ${g.nome}\n${g.resumo}\nItens: ${g.itens.join(", ")}.`).join("\n\n")}

## Assistência técnica

${servicos.map((s) => `- ${s.nome} (${s.publico === "residencia" ? "residência" : "comércio"}): ${s.descricao}`).join("\n")}

## Marcas trabalhadas

${marcas.map((m) => `- ${m.nome}`).join("\n")}

## Empresa

- Razão social: ${negocio.razaoSocial}
- CNPJ: ${negocio.cnpj}
- Inscrição estadual: ${negocio.inscricaoEstadual}
- Inscrição municipal: ${negocio.inscricaoMunicipal}

## Observações

- A loja não vende pela internet: o site leva a conversa para o WhatsApp ou para o balcão.
- Orçamento de assistência técnica é combinado no atendimento, caso a caso.
- Política de privacidade: ${site}/privacidade
`;

  return new Response(texto, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
