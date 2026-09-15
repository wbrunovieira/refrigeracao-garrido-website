/**
 * Registro de revisão do cliente — log append-only em Vercel Blob.
 *
 * **Por que não um banco:** não há relação nem consulta a fazer; o que se quer é prova de que
 * alguém aprovou algo numa data. Um log de eventos imutáveis é a forma mais simples disso, e a
 * mais forte: nada é editado nem apagado, então o histórico não depende de confiar no estado
 * final. O estado atual é derivado — a última palavra sobre cada item vence.
 *
 * **Por que não um arquivo JSON único:** dois cliques simultâneos se sobrescreveriam e um
 * registro sumiria. Um arquivo por evento não tem escrita concorrente.
 *
 * **Por que não JSON em disco:** o sistema de arquivos do Vercel é efêmero — o registro sumiria
 * no deploy seguinte, e cada instância teria a sua cópia.
 *
 * **Hora e IP são do servidor.** Se viessem do navegador, a hora seria o relógio da máquina de
 * quem aprova, que se muda em dois cliques. Aqui a data é carimbada por quem recebe, e o IP sai
 * do cabeçalho da requisição — sem depender de serviço externo nenhum.
 */

import { get, list, put } from "@vercel/blob";

/**
 * A cliente assina como a loja: o nome da dona ainda não foi confirmado. Quando vier, ADICIONE
 * um autor — nunca renomeie este, o histórico gravado aponta para a string exata.
 */
export const AUTORES = [
  "Refrigeração Garrido",
  "Bruno WB Digital Solutions",
] as const;
export type Autor = (typeof AUTORES)[number];

/** De que lado da mesa cada pessoa senta. Decide de quem é a bola a cada evento. */
export type Lado = "cliente" | "agencia";
export const LADO: Record<Autor, Lado> = {
  "Refrigeração Garrido": "cliente",
  "Bruno WB Digital Solutions": "agencia",
};

/**
 * Cada item é uma conversa, e os dois lados falam.
 *
 * O pedido vem de qualquer direção: o cliente pede uma mudança, ou a agência pede material
 * ("preciso de uma foto melhor nesta seção") e o cliente responde ("foto tal, no Drive").
 * Por isso a situação de um item não é sobre aprovação — é sobre **de quem é a bola**:
 *
 *   amarelo = com o cliente · vermelho = com a agência · verde = fechado
 *
 * Uma regra só, que vale nos dois sentidos e deixa a lista legível para os dois.
 *
 * Duas travas continuam:
 * - **A aprovação do conteúdo é sempre do cliente.** Mesmo quando foi a agência que abriu o
 *   pedido e entregou, o item volta para ele dizer se ficou bom.
 * - **O agradecimento é da agência**, e é o que fecha. Enquanto ele não vem, a aprovação é
 *   afirmação de um lado só e o cliente desfaz sem atrito — na revisão se clica errado e se
 *   muda de ideia depois de ver outra página.
 *
 * Nada apaga nada: desfazer e reabrir são eventos novos por cima. O histórico guarda a
 * sequência inteira, que é justamente o que se perde no WhatsApp.
 */
export type Acao =
  /** Abre um item avulso, fora das páginas do site (o `texto` é o título). */
  | "criado"
  /** Pede alguma coisa — de qualquer um dos lados. */
  | "alteracao"
  /** Responde sem mudar de fase; a bola passa para o outro lado. */
  | "resposta"
  /** A agência diz que fez; volta para o cliente conferir. */
  | "ajustado"
  /** O cliente aprova o conteúdo. */
  | "aprovado"
  /** O cliente desfaz a própria aprovação, enquanto ninguém agradeceu. */
  | "desfeito"
  /** A agência agradece e fecha. */
  | "confirmado";

export type Evento = {
  id: string;
  paginaId: string;
  /** `null` quando o comentário ou a aprovação é da página inteira. */
  secaoId: string | null;
  acao: Acao;
  autor: Autor;
  texto?: string;
  /** ISO 8601, carimbado pelo servidor. */
  em: string;
  ip: string;
  userAgent: string;
  /**
   * De onde veio o registro. Ausente = digitado no painel, com IP de verdade.
   * `whatsapp` = pedido que o cliente mandou por lá antes de a ferramenta existir, transcrito
   * daqui para ele não ter de reescrever tudo. `interno` = a nossa resposta, registrada por nós
   * para o assunto ficar fechado no mesmo lugar. Nenhum dos dois finge ter passado pelo painel.
   */
  origem?: "whatsapp" | "interno";
};

const PASTA = "revisao/eventos/";

/** Ordena por data; empate desempata pelo id, que carrega o instante e um sufixo aleatório. */
function porData(a: Evento, b: Evento) {
  return a.em === b.em ? a.id.localeCompare(b.id) : a.em.localeCompare(b.em);
}

/** Item que representa a página inteira, para comentários e status que não são de uma seção. */
export const ITEM_PAGINA = "__pagina";

export async function gravarEventos(
  entradas: Omit<Evento, "id" | "em">[],
): Promise<Evento[]> {
  // Mesmo carimbo de tempo para tudo que veio do mesmo clique — aprovar uma página é um ato só.
  const em = new Date().toISOString();
  const base = em.replace(/[:.]/g, "-");
  const eventos = entradas.map((e, i) => ({
    ...e,
    em,
    id: `${base}-${String(i).padStart(2, "0")}-${Math.random().toString(36).slice(2, 8)}`,
  }));
  await Promise.all(
    eventos.map((evento) =>
      put(`${PASTA}${evento.id}.json`, JSON.stringify(evento), {
        // Privado: um registro de auditoria não pode ser lido por quem descobrir a URL.
        access: "private",
        contentType: "application/json",
        // o nome já é único; sem isto o Blob acrescenta sufixo e o id do arquivo deixa de bater
        addRandomSuffix: false,
      }),
    ),
  );
  return eventos;
}

/**
 * Quantos eventos existem, sem ler nenhum.
 *
 * `lerEventos` faz um `get` por evento, hoje algumas dezenas e crescendo. Para a tela só
 * perguntar "mudou alguma coisa?" isso seria caro à toa: o `list` já devolve os nomes, e o id
 * começa com o instante, então contar e olhar o último nome basta.
 *
 * Uma operação de Blob em vez de uma por evento.
 */
export async function contarEventos(): Promise<{ total: number; ultimo: string | null }> {
  let total = 0;
  let ultimo: string | null = null;
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: PASTA, cursor, limit: 1000 });
    total += r.blobs.length;
    for (const b of r.blobs) {
      const id = b.pathname.slice(PASTA.length).replace(/\.json$/, "");
      if (!ultimo || id > ultimo) ultimo = id;
    }
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return { total, ultimo };
}

export async function lerEventos(): Promise<Evento[]> {
  const eventos: Evento[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: PASTA, cursor, limit: 1000 });
    const lote = await Promise.all(
      r.blobs.map(async (b) => {
        // `useCache: false` porque o registro acabou de mudar quando alguém clica: ler do CDN
        // devolveria a versão anterior e a tela pareceria não ter registrado nada.
        const r = await get(b.pathname, { access: "private", useCache: false });
        if (!r?.stream) return null;
        return (await new Response(r.stream).json()) as Evento;
      }),
    );
    eventos.push(...lote.filter((x): x is Evento => !!x));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return eventos.sort(porData);
}

export type Situacao =
  /**
   * Cinza: ninguém tocou neste item ainda. É o padrão, e por isso precisa ser SILENCIOSO —
   * quando "não olhei" e "estão esperando você responder" tinham a mesma cor, a cor deixava
   * de significar qualquer coisa e a tela virava 55 cartões iguais.
   */
  | "novo"
  /** Amarelo: há conversa aberta e a bola está com o cliente. */
  | "com-cliente"
  /** Vermelho: a bola está com a agência. */
  | "com-agencia"
  /** Verde claro: o cliente aprovou, falta a agência agradecer. */
  | "aprovado"
  /** Verde cheio: fechado por acordo. */
  | "fechado";

/** De quem fica a bola depois de um evento. Vale sempre a última palavra. */
export function situacaoApos(e: Evento): Situacao {
  const outroLado = LADO[e.autor] === "cliente" ? "com-agencia" : "com-cliente";
  switch (e.acao) {
    case "confirmado":
      return "fechado";
    case "aprovado":
      return "aprovado";
    case "ajustado":
      return "com-cliente";
    case "desfeito":
      return "com-cliente";
    // pedir, responder e criar sempre passam a bola para quem não falou
    default:
      return outroLado;
  }
}

/**
 * Situação de cada item, no formato `paginaId/secaoId`. Itens nunca tocados ficam com o
 * cliente: é ele quem tem de revisar.
 */
export function reduzir(eventos: Evento[]): Record<string, Situacao> {
  const mapa: Record<string, Situacao> = {};
  for (const e of eventos) {
    if (!e.secaoId) continue;
    mapa[`${e.paginaId}/${e.secaoId}`] = situacaoApos(e);
  }
  return mapa;
}

/** Página sintética dos itens que não pertencem a nenhuma página do site. */
export const PAGINA_PENDENCIAS = "pendencias-gerais";

/** Itens avulsos abertos pela ferramenta, na ordem em que foram criados. */
export function pendenciasGerais(eventos: Evento[]) {
  return eventos
    .filter((e) => e.paginaId === PAGINA_PENDENCIAS && e.acao === "criado" && e.secaoId)
    .map((e) => ({ id: e.secaoId as string, titulo: e.texto ?? "(sem título)", em: e.em, autor: e.autor }));
}

/** Quem pode agradecer. Trava contra clique errado — não é autenticação. */
export const AUTOR_AGENCIA: Autor = "Bruno WB Digital Solutions";
