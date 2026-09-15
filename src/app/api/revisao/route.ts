import { NextResponse } from "next/server";
import { paginasRevisao } from "@/content/revisao";
import {
  AUTORES,
  ITEM_PAGINA,
  PAGINA_PENDENCIAS,
  gravarEventos,
  lerEventos,
  reduzir,
  type Acao,
  type Autor,
} from "@/lib/revisao";

// O registro muda a cada clique: nada aqui pode ser cacheado.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const eventos = await lerEventos();
    return NextResponse.json({ eventos, situacoes: reduzir(eventos) });
  } catch (e) {
    console.error("[revisao] falha ao ler o registro", e);
    return NextResponse.json({ erro: "falha ao ler o registro" }, { status: 500 });
  }
}

const ACOES: Acao[] = ["criado", "alteracao", "resposta", "ajustado", "aprovado", "desfeito", "confirmado"];

/**
 * O IP vem do cabeçalho que o Vercel escreve na borda. `x-forwarded-for` pode trazer uma cadeia
 * (cliente, proxy, proxy…): o primeiro é o cliente. Em desenvolvimento não existe nenhum dos
 * dois, e aí o registro guarda "local" em vez de mentir com um endereço inventado.
 */
function ipDaRequisicao(req: Request) {
  const encaminhado = req.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

export async function POST(req: Request) {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "corpo inválido" }, { status: 400 });
  }

  const { paginaId, secaoId, acao, autor, texto } = (corpo ?? {}) as Record<string, unknown>;

  if (typeof paginaId !== "string" || !paginaId) {
    return NextResponse.json({ erro: "paginaId obrigatório" }, { status: 400 });
  }
  if (secaoId !== null && typeof secaoId !== "string") {
    return NextResponse.json({ erro: "secaoId inválido" }, { status: 400 });
  }
  if (typeof acao !== "string" || !ACOES.includes(acao as Acao)) {
    return NextResponse.json({ erro: "ação inválida" }, { status: 400 });
  }
  if (typeof autor !== "string" || !AUTORES.includes(autor as Autor)) {
    return NextResponse.json({ erro: "autor inválido" }, { status: 400 });
  }
  // pedir, responder e criar exigem texto; aprovar, desfazer, agradecer e ajustar não
  if (
    (acao === "alteracao" || acao === "resposta" || acao === "criado") &&
    (typeof texto !== "string" || !texto.trim())
  ) {
    return NextResponse.json({ erro: "escreva o que precisa" }, { status: 400 });
  }

  // As pendências gerais não vêm do arquivo de conteúdo: nascem aqui, pela própria ferramenta.
  const pagina =
    paginaId === PAGINA_PENDENCIAS ? null : paginasRevisao.find((p) => p.id === paginaId);
  if (!pagina && paginaId !== PAGINA_PENDENCIAS) {
    return NextResponse.json({ erro: "página desconhecida" }, { status: 400 });
  }

  /**
   * Aprovar (ou agradecer) uma página grava um evento POR SEÇÃO, não um evento coletivo. Custa
   * alguns arquivos a mais e paga na auditoria: cada item tem registro próprio, com a mesma data
   * e o mesmo autor. Um evento coletivo obrigaria a interpretar depois o que ele cobria — e o
   * que ele cobria mudaria sozinho se a lista de seções mudasse.
   */
  const emLote = !!pagina && secaoId === null && (acao === "aprovado" || acao === "confirmado");
  /**
   * O lote inclui o ITEM_PAGINA junto com as seções. Sem ele, uma conversa aberta sobre a página
   * inteira — pedido cuja seção deixou de existir, assunto que não é de nenhuma seção — ficava
   * impossível de aprovar: "Está tudo certo" aprovava as seções nomeadas e deixava o item da
   * página em aberto, e a única ação restante era "Responder", que devolve a bola em vez de
   * fechar. O cartão dizia "8 de 8 aprovadas" e mesmo assim continuava marcado como pendente.
   */
  const alvos = emLote
    ? [ITEM_PAGINA, ...pagina!.secoes.map((s) => s.id)]
    : [(secaoId as string | null) ?? ITEM_PAGINA];

  const comum = {
    paginaId,
    acao: acao as Acao,
    autor: autor as Autor,
    texto: typeof texto === "string" && texto.trim() ? texto.trim().slice(0, 4000) : undefined,
    ip: ipDaRequisicao(req),
    userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  };

  try {
    const eventos = await gravarEventos(alvos.map((id) => ({ ...comum, secaoId: id })));
    return NextResponse.json({ eventos });
  } catch (e) {
    console.error("[revisao] falha ao gravar", e);
    return NextResponse.json({ erro: "falha ao gravar o registro" }, { status: 500 });
  }
}
