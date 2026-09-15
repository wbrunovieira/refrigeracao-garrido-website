"use client";

/**
 * Painel de revisão — a tela que substitui a conversa de WhatsApp entre a loja e a WB.
 *
 * É o mesmo painel usado nos outros projetos da WB, com uma diferença de forma: o site da
 * Garrido é uma página só, então cada SEÇÃO é um cartão — na ordem em que aparece rolando, do
 * cabeçalho ao rodapé — em vez de páginas com partes escondidas numa sanfona.
 *
 * As três decisões de origem continuam valendo:
 *
 * 1. **Uma ação principal por cartão.** Cada cartão calcula qual é *a* coisa a fazer agora
 *    (`Acoes`) e só ela é preenchida; o resto é contorno.
 * 2. **A cor é relativa a quem está lendo** (ver `tom` em `ui.tsx`): só o que espera pela
 *    pessoa com a tela aberta pode ter cor forte.
 * 3. **A pergunta em aberto vem para a frente do cartão.** A resposta da WB não pode ficar a
 *    dois toques de distância, senão a cliente volta a perguntar no WhatsApp.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DETALHE, PAGINA_SITE, paginasRevisao } from "@/content/revisao";
import {
  AUTORES,
  ITEM_PAGINA,
  LADO,
  PAGINA_PENDENCIAS,
  pendenciasGerais,
  type Autor,
  type Evento,
  type Situacao,
} from "@/lib/revisao";
import { Conversa, Campo } from "./Conversa";
import {
  Aviso,
  Botao,
  LinkSaida,
  NOME_AGENCIA,
  NOME_CLIENTE,
  PONTO,
  Selo,
  TRILHO,
  apelido,
  haQuanto,
  rotulo,
  tom,
  type Tom,
} from "./ui";

/** Filtros pela ótica de quem lê, não pelos nomes internos dos estados. */
type Filtro = "tudo" | "voce" | "eles" | "novo" | "pronto";

const SECOES = paginasRevisao.find((p) => p.id === PAGINA_SITE)!.secoes;

/* ------------------------------------------------------------------ contexto */

type Acoes = {
  autor: Autor;
  souAgencia: boolean;
  ocupado: string | null;
  erroDe: (alvo: string) => string | null;
  flash: string | null;
  escrevendo: string | null;
  abrirEscrita: (chave: string | null) => void;
  rascunho: string;
  setRascunho: (v: string) => void;
  registrar: (paginaId: string, secaoId: string | null, acao: string, texto?: string) => void;
  sit: (paginaId: string, itemId: string) => Situacao;
  eventosDe: (paginaId: string, itemId?: string) => Evento[];
};

const Ctx = createContext<Acoes | null>(null);
function useAcoes() {
  const c = useContext(Ctx);
  if (!c) throw new Error("fora do painel");
  return c;
}

/* ------------------------------------------------------------------ painel */

export function PainelRevisao({
  eventosIniciais,
  situacoesIniciais,
}: {
  eventosIniciais: Evento[];
  situacoesIniciais: Record<string, Situacao>;
}) {
  const [eventos, setEventos] = useState(eventosIniciais);
  const [situacoes, setSituacoes] = useState(situacoesIniciais);
  const [autor, setAutor] = useState<Autor>(AUTORES[0]);
  const [filtro, setFiltro] = useState<Filtro>("tudo");
  const [aberta, setAberta] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<{ alvo: string; msg: string } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [escrevendo, setEscrevendo] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [novoAssunto, setNovoAssunto] = useState(false);
  /**
   * Quantos eventos existem no servidor além dos que temos aqui. A tela NÃO se atualiza
   * sozinha, de propósito: o cartão aberto podia pular de fila e sumir debaixo de quem escreve.
   * Só acende um aviso; quem decide atualizar é a pessoa.
   */
  const [novidades, setNovidades] = useState(0);
  const [atualizando, setAtualizando] = useState(false);

  const souAgencia = LADO[autor] === "agencia";

  useEffect(() => {
    let vivo = true;
    const conferir = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const r = await fetch("/api/revisao/novidades", { cache: "no-store" });
        const d = await r.json();
        if (vivo && typeof d?.total === "number") {
          setNovidades(d.total > eventos.length ? d.total - eventos.length : 0);
        }
      } catch {
        // Sem rede a tela continua servindo para ler e escrever: o aviso apenas não acende.
      }
    };
    const t = setInterval(conferir, 30000);
    document.addEventListener("visibilitychange", conferir);
    conferir();
    return () => {
      vivo = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", conferir);
    };
  }, [eventos.length]);

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    try {
      const r = await fetch("/api/revisao", { cache: "no-store" });
      const d = await r.json();
      if (Array.isArray(d?.eventos)) {
        setEventos(d.eventos);
        if (d.situacoes) setSituacoes(d.situacoes);
        setNovidades(0);
      }
    } catch {
      // Mantém o aviso aceso para a pessoa tentar de novo.
    } finally {
      setAtualizando(false);
    }
  }, []);

  const sit = useCallback(
    (paginaId: string, itemId: string): Situacao => situacoes[`${paginaId}/${itemId}`] ?? "novo",
    [situacoes],
  );

  const porPagina = useMemo(() => {
    const m = new Map<string, Evento[]>();
    for (const e of eventos) m.set(e.paginaId, [...(m.get(e.paginaId) ?? []), e]);
    return m;
  }, [eventos]);

  const eventosDe = useCallback(
    (paginaId: string, itemId?: string) => {
      const todos = porPagina.get(paginaId) ?? [];
      return itemId ? todos.filter((e) => e.secaoId === itemId) : todos;
    },
    [porPagina],
  );

  const registrar = useCallback(
    async (paginaId: string, secaoId: string | null, acao: string, texto?: string) => {
      const alvo = `${paginaId}/${secaoId ?? "pagina"}`;
      setOcupado(`${alvo}/${acao}`);
      setErro(null);
      try {
        const r = await fetch("/api/revisao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paginaId, secaoId, acao, autor, texto }),
          // Ela usa isto na loja, com sinal instável. Sem prazo, uma requisição pendurada deixa
          // o botão em "Enviando…" para sempre e não há como saber se gravou ou não.
          signal: AbortSignal.timeout(20000),
        });
        const dados = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(dados?.erro ?? "falhou");
        const novos: Evento[] = dados.eventos;
        setEventos((e) => [...e, ...novos]);
        setSituacoes((s) => {
          const m = { ...s };
          for (const ev of novos) {
            if (!ev.secaoId) continue;
            const outro = LADO[ev.autor] === "cliente" ? "com-agencia" : "com-cliente";
            m[`${ev.paginaId}/${ev.secaoId}`] =
              ev.acao === "confirmado"
                ? "fechado"
                : ev.acao === "aprovado"
                  ? "aprovado"
                  : ev.acao === "ajustado" || ev.acao === "desfeito"
                    ? "com-cliente"
                    : (outro as Situacao);
          }
          return m;
        });
        setEscrevendo(null);
        setRascunho("");
        setNovoAssunto(false);
        setFlash(alvo);
        setTimeout(() => setFlash((f) => (f === alvo ? null : f)), 700);
      } catch (e) {
        const rede =
          e instanceof DOMException || (e instanceof TypeError && e.message.includes("fetch"));
        setErro({
          alvo,
          msg: rede
            ? "Não deu para salvar — a internet parece ter caído. Confira o sinal e toque de novo."
            : "Não deu para salvar agora. Toque de novo; se continuar, me chame no WhatsApp que eu registro por aqui.",
        });
      } finally {
        setOcupado(null);
      }
    },
    [autor],
  );

  const erroDe = useCallback((alvo: string) => (erro?.alvo === alvo ? erro.msg : null), [erro]);

  const abrirEscrita = useCallback((chave: string | null) => {
    setEscrevendo(chave);
    setRascunho("");
    setErro(null);
  }, []);

  /** Os itens da lista: as seções do site, o site como um todo e os assuntos avulsos. */
  type Linha = { chave: string; paginaId: string; secaoId: string; titulo: string; tipo: "secao" | "site" | "assunto" };
  const linhas: Linha[] = useMemo(() => {
    const secoes: Linha[] = SECOES.map((s) => ({
      chave: `${PAGINA_SITE}/${s.id}`,
      paginaId: PAGINA_SITE,
      secaoId: s.id,
      titulo: s.titulo,
      tipo: "secao",
    }));
    const site: Linha = {
      chave: `${PAGINA_SITE}/${ITEM_PAGINA}`,
      paginaId: PAGINA_SITE,
      secaoId: ITEM_PAGINA,
      titulo: "O site como um todo",
      tipo: "site",
    };
    const assuntos: Linha[] = pendenciasGerais(eventos).map((x) => ({
      chave: `${PAGINA_PENDENCIAS}/${x.id}`,
      paginaId: PAGINA_PENDENCIAS,
      secaoId: x.id,
      titulo: x.titulo,
      tipo: "assunto",
    }));
    return [...secoes, site, ...assuntos];
  }, [eventos]);

  const sitLinha = useCallback((l: Linha) => sit(l.paginaId, l.secaoId), [sit]);

  /** A última fala pendente de cada item — o que sobe para a frente do cartão. */
  const emAberto = useMemo(() => {
    const m = new Map<string, Evento>();
    for (const l of linhas) {
      const s = sitLinha(l);
      if (s !== "com-cliente" && s !== "com-agencia") continue;
      const falas = eventosDe(l.paginaId, l.secaoId).filter((e) => e.texto);
      if (falas.length) m.set(l.chave, falas[falas.length - 1]);
    }
    return m;
  }, [linhas, sitLinha, eventosDe]);

  const secoes = useMemo(() => linhas.filter((l) => l.tipo === "secao"), [linhas]);
  const total = secoes.length;
  const prontas = useMemo(
    () => secoes.filter((l) => ["aprovado", "fechado"].includes(sitLinha(l))).length,
    [secoes, sitLinha],
  );

  const contagem = useMemo(() => {
    const c: Record<Tom, number> = { silencio: 0, voce: 0, eles: 0, aprovado: 0, pronto: 0 };
    for (const l of linhas) c[tom(sitLinha(l), souAgencia)]++;
    return c;
  }, [linhas, sitLinha, souAgencia]);

  // "novo" fica fora das filas de propósito: é o silêncio do padrão, não uma dívida de ninguém.
  const comCliente = useMemo(() => linhas.filter((l) => sitLinha(l) === "com-cliente"), [linhas, sitLinha]);
  // "aprovado" entra na fila da WB: a cliente já falou, falta a gente confirmar e fechar.
  const comAgencia = useMemo(
    () => linhas.filter((l) => ["com-agencia", "aprovado"].includes(sitLinha(l))),
    [linhas, sitLinha],
  );

  const combina = useCallback(
    (l: Linha) => {
      const t = tom(sitLinha(l), souAgencia);
      if (filtro === "tudo") return true;
      if (filtro === "pronto") return t === "aprovado" || t === "pronto";
      if (filtro === "novo") return t === "silencio";
      return t === filtro;
    },
    [filtro, sitLinha, souAgencia],
  );

  const visiveis = useMemo(() => linhas.filter(combina), [linhas, combina]);
  const pct = total ? Math.round((prontas / total) * 100) : 0;

  const irPara = useCallback((chave: string) => {
    setAberta(chave);
    requestAnimationFrame(() =>
      document.getElementById(`item-${chave}`)?.scrollIntoView({ block: "start", behavior: "smooth" }),
    );
  }, []);

  const acoes: Acoes = {
    autor, souAgencia, ocupado, erroDe, flash, escrevendo, abrirEscrita, rascunho, setRascunho, registrar, sit, eventosDe,
  };

  const grupos: [string, Linha[]][] = [
    ["Seções do site, de cima para baixo", visiveis.filter((l) => l.tipo === "secao")],
    ["O site inteiro", visiveis.filter((l) => l.tipo === "site")],
    ["Outros assuntos", visiveis.filter((l) => l.tipo === "assunto")],
  ];

  return (
    <Ctx.Provider value={acoes}>
      <div className="mx-auto max-w-4xl px-4 pb-28 sm:px-6">
        <Abertura autor={autor} setAutor={setAutor} prontas={prontas} total={total} pct={pct} />

        <BarraFiltros
          filtro={filtro}
          setFiltro={setFiltro}
          contagem={contagem}
          totalLinhas={linhas.length}
          souAgencia={souAgencia}
          novidades={novidades}
          atualizar={atualizar}
          atualizando={atualizando}
        />

        {filtro === "tudo" && (comCliente.length > 0 || comAgencia.length > 0) && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Fila
              titulo={`Esperando ${NOME_CLIENTE}`}
              nota="Precisa de aprovação ou resposta da loja."
              linhas={comCliente}
              lado="cliente"
              souAgencia={souAgencia}
              irPara={irPara}
            />
            <Fila
              titulo={`Esperando a ${NOME_AGENCIA}`}
              nota="Estamos resolvendo por aqui."
              linhas={comAgencia}
              lado="agencia"
              souAgencia={souAgencia}
              irPara={irPara}
            />
          </div>
        )}

        {grupos.map(([grupo, itens]) =>
          itens.length === 0 ? null : (
            <section key={grupo} className="mt-9">
              <h2 className="flex flex-wrap items-baseline gap-x-2 text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--wb-tinta-2)]">
                {grupo}
                <span className="font-medium normal-case tracking-normal text-[var(--wb-tinta-3)]">
                  {grupo.startsWith("Seções") ? `${itens.length} de ${total}` : itens.length}
                </span>
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {itens.map((l, i) => (
                  <Cartao
                    key={l.chave}
                    linha={l}
                    numero={l.tipo === "secao" ? SECOES.findIndex((s) => s.id === l.secaoId) + 1 : undefined}
                    i={i}
                    situacao={sitLinha(l)}
                    aberto={aberta === l.chave}
                    alternar={() => setAberta(aberta === l.chave ? null : l.chave)}
                    pendente={emAberto.get(l.chave)}
                  />
                ))}
              </ul>
            </section>
          ),
        )}

        {visiveis.length === 0 && (
          <p className="mt-10 rounded-2xl border border-[var(--wb-linha)] bg-white p-10 text-center text-[15px] text-[var(--wb-tinta-2)]">
            Nada nesta lista — experimente &ldquo;Tudo&rdquo;.
          </p>
        )}

        <NovoAssunto
          aberto={novoAssunto}
          abrir={setNovoAssunto}
          rascunho={rascunho}
          setRascunho={setRascunho}
          registrar={registrar}
          ocupado={ocupado}
          erro={erroDe(`${PAGINA_PENDENCIAS}/pagina`)}
          autor={autor}
        />
      </div>
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ abertura */

function Abertura({
  autor, setAutor, prontas, total, pct,
}: {
  autor: Autor; setAutor: (a: Autor) => void; prontas: number; total: number; pct: number;
}) {
  return (
    <header className="pt-8 sm:pt-12">
      <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--wb-roxo-vivo)]">
        Refrigeração Garrido
      </p>
      <h1 className="mt-1.5 text-[30px] font-extrabold leading-[1.08] tracking-tight text-[var(--wb-roxo)] sm:text-[42px]">
        Revisão do site novo
      </h1>
      <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-[var(--wb-tinta-2)]">
        Abra o site, role de cima a baixo e diga, seção por seção, se está certo. O que precisar
        mudar, escreva aqui — fica guardado com data e nome.
      </p>

      <div className="wb-entra mt-6 overflow-hidden rounded-2xl border border-[var(--wb-linha)] bg-white shadow-[0_14px_40px_-30px_rgba(53,5,69,0.6)]">
        <label className="flex items-center gap-3 border-b border-[var(--wb-linha)] px-3.5 py-2.5">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--wb-roxo)] text-[15px] font-bold text-white"
          >
            {apelido(autor)[0]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-medium text-[var(--wb-tinta-3)]">Quem está revisando</span>
            <select
              value={autor}
              onChange={(e) => setAutor(e.target.value as Autor)}
              className="wb-foco -ml-1 w-full max-w-full rounded-lg bg-transparent px-1 text-[16px] font-bold text-[var(--wb-tinta)] focus:outline-none"
              // 44px de alvo mesmo sendo um select nativo: é o único controle que decide de
              // quem é a assinatura do registro; errar nele adultera a auditoria.
              style={{ minHeight: 44 }}
            >
              {AUTORES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </span>
        </label>

        <div className="p-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-bold text-[var(--wb-tinta)]">
              {prontas} de {total} seções prontas
            </p>
            <p className="text-[13px] font-semibold text-[var(--wb-tinta-3)]">{pct}%</p>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--wb-linha)]"
            role="progressbar"
            aria-valuenow={prontas}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Seções prontas"
          >
            <div className="wb-progresso h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.max(pct, 1.5)}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ filtros */

function BarraFiltros({
  filtro, setFiltro, contagem, totalLinhas, souAgencia, novidades, atualizar, atualizando,
}: {
  filtro: Filtro; setFiltro: (f: Filtro) => void; contagem: Record<Tom, number>; totalLinhas: number;
  souAgencia: boolean; novidades: number; atualizar: () => void; atualizando: boolean;
}) {
  // Os chips nomeiam os lados, na MESMA ordem das colunas — cliente primeiro, sempre.
  const filtroCliente: Filtro = souAgencia ? "eles" : "voce";
  const filtroAgencia: Filtro = souAgencia ? "voce" : "eles";
  const nCliente = souAgencia ? contagem.eles : contagem.voce;
  const nAgencia = souAgencia ? contagem.voce : contagem.eles;
  const chips: [Filtro, string, number][] = [
    ["tudo", "Tudo", totalLinhas],
    [filtroCliente, `Esperando ${NOME_CLIENTE}`, nCliente],
    [filtroAgencia, "Esperando a WB", nAgencia],
    ["novo", "Falta olhar", contagem.silencio],
    ["pronto", "Prontas", contagem.aprovado + contagem.pronto],
  ];
  return (
    <div className="sticky top-0 z-30 -mx-4 mt-6 flex items-center gap-2 border-y border-[var(--wb-linha)] bg-[var(--wb-fundo)]/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div
        role="group"
        aria-label="Filtrar a lista"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {chips.map(([id, texto, n]) => {
          const ativo = filtro === id;
          const vazio = n === 0 && id !== "tudo";
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFiltro(id)}
              aria-pressed={ativo}
              disabled={vazio}
              className={`wb-foco inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors duration-150 disabled:opacity-40 ${
                ativo
                  ? "bg-[var(--wb-roxo)] text-white"
                  : id === "voce" && n > 0
                    ? "bg-[var(--wb-ambar-leve)] text-[var(--wb-ambar-tinta)] ring-1 ring-[var(--wb-ambar-borda)]"
                    : "bg-white text-[var(--wb-tinta-2)] ring-1 ring-[var(--wb-linha)] hover:ring-[var(--wb-lilas)]"
              }`}
            >
              {texto}
              <span className={ativo ? "text-white/70" : "text-[var(--wb-tinta-3)]"}>{n}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={atualizar}
        disabled={atualizando}
        title={novidades > 0 ? "Há registro novo desde que esta página abriu" : "Buscar o que mudou"}
        className={`wb-foco inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[14px] font-semibold transition-colors duration-150 disabled:opacity-50 ${
          novidades > 0
            ? "bg-[var(--wb-ambar-leve)] text-[var(--wb-ambar-tinta)] ring-1 ring-[var(--wb-ambar-borda)]"
            : "bg-white text-[var(--wb-tinta-2)] ring-1 ring-[var(--wb-linha)] hover:ring-[var(--wb-lilas)]"
        }`}
      >
        <svg viewBox="0 0 24 24" className={`size-4 shrink-0 ${atualizando ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M20 11a8 8 0 1 0-.6 4" strokeLinecap="round" />
          <path d="M20 4.5V11h-6.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline" aria-hidden>{atualizando ? "Buscando" : "Atualizar"}</span>
        {novidades > 0 && !atualizando && (
          <span aria-hidden className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--wb-ambar-tinta)] px-1.5 text-[12px] font-bold text-white">
            {novidades}
          </span>
        )}
        <span className="sr-only">
          {novidades > 0
            ? `Atualizar a lista. Há ${novidades} ${novidades === 1 ? "registro novo" : "registros novos"}.`
            : "Atualizar a lista"}
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ filas */

function Fila({
  titulo, nota, linhas, lado, souAgencia, irPara,
}: {
  titulo: string; nota: string; linhas: { chave: string; titulo: string }[]; lado: "cliente" | "agencia";
  souAgencia: boolean; irPara: (chave: string) => void;
}) {
  const n = linhas.length;
  const minha = souAgencia === (lado === "agencia");
  const vazia = n === 0;
  return (
    <section
      className={`wb-entra overflow-hidden rounded-2xl ring-1 ${
        vazia ? "bg-white/60 ring-[var(--wb-linha)]" : minha ? "bg-[var(--wb-ambar-leve)] ring-[var(--wb-ambar-borda)]" : "bg-white ring-[var(--wb-linha)]"
      }`}
    >
      <div className="px-4 pb-1 pt-3.5">
        <h2 className="flex items-baseline gap-2 text-[15px] font-extrabold text-[var(--wb-tinta)]">
          <span
            aria-hidden
            className={`size-2.5 shrink-0 rounded-full ${vazia ? "bg-[var(--wb-linha)]" : lado === "cliente" ? "bg-[var(--wb-ambar)]" : "bg-[var(--wb-roxo-vivo)]"}`}
          />
          {titulo}
          <span className="ml-auto text-[13px] font-bold tabular-nums text-[var(--wb-tinta-3)]">{n}</span>
        </h2>
        <p className="mt-0.5 text-[13px] text-[var(--wb-tinta-3)]">{vazia ? "Nada por aqui." : nota}</p>
      </div>
      {!vazia && (
        <ul className="mt-1 px-1.5 pb-1.5">
          {linhas.slice(0, 6).map((l) => (
            <li key={l.chave}>
              <button
                type="button"
                onClick={() => irPara(l.chave)}
                className="wb-foco flex min-h-11 w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/70"
              >
                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--wb-tinta)]">{l.titulo}</span>
                <svg viewBox="0 0 12 12" aria-hidden className="size-3.5 shrink-0 opacity-50">
                  <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
          {n > 6 && <li className="px-2.5 py-2 text-[13px] font-medium text-[var(--wb-tinta-3)]">e mais {n - 6} abaixo</li>}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ ações */

/**
 * As ações de um item, já hierarquizadas: pergunta em aberto para você > aprovar > só olhar.
 * Responder ganha de aprovar quando alguém perguntou alguma coisa.
 */
function Acoes({
  paginaId, secaoId, titulo, href, situacao, assunto, siteInteiro, temPergunta,
}: {
  paginaId: string;
  /** `null` = o site inteiro: aprovar/agradecer vale para todas as seções de uma vez. */
  secaoId: string | null;
  titulo: string;
  href?: string;
  situacao: Situacao;
  assunto?: boolean;
  siteInteiro?: boolean;
  temPergunta?: boolean;
}) {
  const a = useAcoes();
  const chave = `${paginaId}/${secaoId ?? "pagina"}`;
  const t = tom(situacao, a.souAgencia);
  const eventos = a.eventosDe(paginaId, secaoId ?? ITEM_PAGINA);
  const ultimoAutor = eventos.length ? eventos[eventos.length - 1].autor : null;
  const conversando = eventos.some((e) => e.texto);
  const oc = (acao: string) => a.ocupado === `${chave}/${acao}`;

  /** Só a cliente aprova conteúdo do site. Em assunto avulso, aprova quem está com a bola. */
  const podeAprovar = assunto ? t === "voce" : !a.souAgencia && (t === "voce" || t === "silencio");
  const podeConfirmar =
    situacao === "aprovado" &&
    (assunto ? !!ultimoAutor && LADO[ultimoAutor] !== (a.souAgencia ? "agencia" : "cliente") : a.souAgencia);
  const podeDesfazer =
    situacao === "aprovado" && !!ultimoAutor && LADO[ultimoAutor] === (a.souAgencia ? "agencia" : "cliente");

  const escrever = () => a.abrirEscrita(a.escrevendo === chave ? null : chave);
  const rotuloEscrita = conversando ? "Responder" : a.souAgencia ? "Preciso de algo" : "Quero mudar algo";
  const rotuloAprovar = assunto ? "Está resolvido" : siteInteiro ? "O site inteiro está certo" : "Está certo";

  const principal: ReactNode[] = [];
  if (temPergunta && t === "voce") {
    principal.push(<Botao key="p" peso="destaque" largo onClick={escrever}>Responder</Botao>);
  } else if (podeAprovar) {
    principal.push(
      <Botao key="p" peso="aprovar" largo ocupado={oc("aprovado")} onClick={() => a.registrar(paginaId, secaoId, "aprovado")}>
        {oc("aprovado") ? "Guardando…" : rotuloAprovar}
      </Botao>,
    );
  } else if (podeConfirmar) {
    principal.push(
      <Botao key="p" peso="destaque" largo ocupado={oc("confirmado")} onClick={() => a.registrar(paginaId, secaoId, "confirmado")}>
        {assunto ? "Pode fechar" : "Agradecer e fechar"}
      </Botao>,
    );
  } else if (a.souAgencia && t === "voce" && !assunto) {
    principal.push(
      <Botao key="p" peso="atencao" largo ocupado={oc("ajustado")} onClick={() => a.registrar(paginaId, secaoId, "ajustado", "Já arrumei, pode conferir.")}>
        Já arrumei
      </Botao>,
    );
  }

  const secundarios: ReactNode[] = [];
  if (href) secundarios.push(<LinkSaida key="ver" href={href}>Ver no site</LinkSaida>);
  if (temPergunta && t === "voce" && podeAprovar) {
    secundarios.push(
      <Botao key="ok" peso="sim" ocupado={oc("aprovado")} onClick={() => a.registrar(paginaId, secaoId, "aprovado")}>
        {rotuloAprovar}
      </Botao>,
    );
  } else {
    secundarios.push(<Botao key="esc" onClick={escrever}>{rotuloEscrita}</Botao>);
  }
  if (podeDesfazer) {
    secundarios.push(
      <Botao key="und" peso="discreto" ocupado={oc("desfeito")} onClick={() => a.registrar(paginaId, secaoId, "desfeito")}>
        Voltar atrás
      </Botao>,
    );
  }

  const erro = a.erroDe(chave);

  return (
    <>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {principal}
        <div className="flex flex-wrap gap-2">{secundarios}</div>
      </div>
      {erro && !a.escrevendo && <Aviso>{erro}</Aviso>}
      {a.escrevendo === chave && (
        <Campo
          valor={a.rascunho}
          onChange={a.setRascunho}
          onCancelar={() => a.abrirEscrita(null)}
          onEnviar={() => a.registrar(paginaId, secaoId ?? ITEM_PAGINA, conversando ? "resposta" : "alteracao", a.rascunho)}
          ocupado={oc("resposta") || oc("alteracao")}
          erro={erro}
          assinatura={apelido(a.autor)}
          dica={conversando ? "Sua resposta" : siteInteiro ? "O que precisa mudar no site?" : `O que precisa mudar em “${titulo}”?`}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ pergunta aberta */

function PerguntaAberta({ ev, praVoce, abrir }: { ev: Evento; praVoce: boolean; abrir: () => void }) {
  return (
    <button
      type="button"
      onClick={abrir}
      className={`wb-foco mt-3 block w-full rounded-xl border-l-4 px-3.5 py-3 text-left transition-colors ${
        praVoce
          ? "border-[var(--wb-ambar-borda)] bg-[var(--wb-ambar-leve)] hover:bg-[#fff0d2]"
          : "border-[var(--wb-roxo-vivo)] bg-[var(--wb-roxo-leve)] hover:bg-[#efe4f7]"
      }`}
    >
      <p className="flex items-baseline gap-x-1.5 text-[12.5px] font-semibold text-[var(--wb-tinta-2)]">
        <span className="text-[var(--wb-tinta)]">{apelido(ev.autor)}</span>
        <span className="font-medium">{ev.acao === "ajustado" ? "arrumou" : "escreveu"}</span>
        <span className="font-medium" suppressHydrationWarning>{haQuanto(ev.em)}</span>
      </p>
      <p className="mt-1 line-clamp-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--wb-tinta)]">{ev.texto}</p>
      <span className="mt-1.5 inline-block text-[13px] font-bold text-[var(--wb-roxo-vivo)] underline underline-offset-4">
        {praVoce ? "ler tudo e responder" : "ver a conversa"}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ cartão */

/**
 * Um cartão por item. O número existe só nas seções, porque ali a ordem É informação: é a
 * ordem em que a pessoa encontra cada coisa rolando o site.
 */
function Cartao({
  linha, numero, i, situacao, aberto, alternar, pendente,
}: {
  linha: { chave: string; paginaId: string; secaoId: string; titulo: string; tipo: "secao" | "site" | "assunto" };
  numero?: number;
  i: number;
  situacao: Situacao;
  aberto: boolean;
  alternar: () => void;
  pendente?: Evento;
}) {
  const a = useAcoes();
  const t = tom(situacao, a.souAgencia);
  const eventos = a.eventosDe(linha.paginaId, linha.secaoId);
  const detalhe = linha.tipo === "secao" ? DETALHE[linha.secaoId] : undefined;
  const siteInteiro = linha.tipo === "site";
  const falas = eventos.filter((e) => e.texto).length;

  return (
    <li
      id={`item-${linha.chave}`}
      style={{ "--i": Math.min(i, 10), "--wb-cor-trilho": TRILHO[t] } as React.CSSProperties}
      className={`wb-entra wb-cartao wb-trilho wb-alvo overflow-hidden rounded-2xl border border-[var(--wb-linha)] bg-white shadow-[0_8px_24px_-20px_rgba(53,5,69,0.55)] ${
        a.flash === linha.chave || (siteInteiro && a.flash === `${linha.paginaId}/pagina`) ? "wb-flash" : ""
      }`}
    >
      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {(numero || detalhe?.etiqueta) && (
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--wb-tinta-3)]">
                {numero && <span className="tabular-nums text-[var(--wb-roxo-vivo)]">{String(numero).padStart(2, "0")}</span>}
                {detalhe?.etiqueta}
              </p>
            )}
            <h3 className="mt-0.5 text-[18px] font-bold leading-tight text-[var(--wb-tinta)] [text-wrap:balance]">
              {linha.titulo}
            </h3>
            {detalhe && <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--wb-tinta-2)]">{detalhe.nota}</p>}
            {siteInteiro && (
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--wb-tinta-2)]">
                O que não é de uma seção só: cores, tom das frases, velocidade, o conjunto. Aprovar
                aqui aprova todas as seções de uma vez.
              </p>
            )}
            <p className="mt-1.5 flex items-center gap-2 text-[13px] text-[var(--wb-tinta-3)]">
              <span className={`size-2.5 shrink-0 rounded-full ${PONTO[t]}`} role="img" aria-label={rotulo(situacao, a.souAgencia)} />
              {t === "silencio" ? "ainda não olhada" : rotulo(situacao, a.souAgencia)}
            </p>
          </div>
          <Selo situacao={situacao} souAgencia={a.souAgencia} />
        </div>

        {pendente && (
          <PerguntaAberta
            ev={pendente}
            praVoce={t === "voce"}
            abrir={() => {
              if (!aberto) alternar();
            }}
          />
        )}

        <Acoes
          paginaId={linha.paginaId}
          secaoId={siteInteiro ? null : linha.secaoId}
          titulo={linha.titulo}
          href={detalhe?.href}
          situacao={situacao}
          assunto={linha.tipo === "assunto"}
          siteInteiro={siteInteiro}
          temPergunta={!!pendente}
        />

        {falas > 0 && (
          <button
            type="button"
            onClick={alternar}
            aria-expanded={aberto}
            aria-controls={`conversa-${linha.chave}`}
            className="wb-foco -ml-2 mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-[14px] font-semibold text-[var(--wb-tinta-3)] transition-colors hover:text-[var(--wb-roxo)]"
          >
            {aberto ? "esconder a conversa" : `ver a conversa (${falas})`}
            <svg viewBox="0 0 12 12" aria-hidden className={`size-3.5 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`}>
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {eventos.length > 0 && (
        <Sanfona aberta={aberto} id={`conversa-${linha.chave}`}>
          <div className="border-t border-[var(--wb-linha)] bg-[var(--wb-fundo)] px-4 pb-4 pt-1 sm:px-5">
            <Conversa eventos={eventos} souAgencia={a.souAgencia} />
          </div>
        </Sanfona>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ sanfona */

function Sanfona({ aberta, id, children }: { aberta: boolean; id: string; children: ReactNode }) {
  return (
    <div className="wb-sanfona" data-aberta={aberta}>
      <div id={id} inert={!aberta}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ novo assunto */

function NovoAssunto({
  aberto, abrir, rascunho, setRascunho, registrar, ocupado, erro, autor,
}: {
  aberto: boolean; abrir: (v: boolean) => void; rascunho: string; setRascunho: (v: string) => void;
  registrar: (p: string, s: string | null, a: string, t?: string) => void; ocupado: string | null;
  erro: string | null; autor: Autor;
}) {
  return (
    <section className="mt-9 rounded-2xl border border-dashed border-[var(--wb-lilas)] bg-white/60 p-4 sm:p-5">
      <h2 className="text-[15px] font-bold text-[var(--wb-tinta)]">Precisa falar de algo que não é de nenhuma seção?</h2>
      <p className="mt-1 text-[14px] leading-relaxed text-[var(--wb-tinta-2)]">
        Prazo, domínio, uma foto que quer mandar, um dado que falta — abra aqui que entra na
        mesma lista e não se perde.
      </p>
      {aberto ? (
        <div className="mt-3">
          <label htmlFor="novo-assunto" className="block text-[14px] font-semibold text-[var(--wb-tinta)]">Do que se trata?</label>
          <input
            id="novo-assunto"
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            autoFocus
            placeholder="Ex.: tenho fotos novas da loja para mandar"
            className="wb-foco mt-2 w-full rounded-xl border border-[var(--wb-lilas)] bg-white px-3 py-3 text-[16px] text-[var(--wb-tinta)] placeholder:text-[var(--wb-tinta-3)] focus:border-[var(--wb-roxo-vivo)] focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Botao
              peso="destaque"
              disabled={!rascunho.trim()}
              ocupado={!!ocupado?.endsWith("/criado")}
              onClick={() => registrar(PAGINA_PENDENCIAS, `p-${Date.now().toString(36)}`, "criado", rascunho)}
            >
              Abrir assunto
            </Botao>
            <Botao peso="discreto" onClick={() => abrir(false)}>Cancelar</Botao>
            <span className="ml-auto text-[12.5px] text-[var(--wb-tinta-3)]">
              assinando como <strong className="font-semibold">{apelido(autor)}</strong>
            </span>
          </div>
          {erro && <Aviso>{erro}</Aviso>}
        </div>
      ) : (
        <Botao className="mt-3" onClick={() => { abrir(true); setRascunho(""); }}>Abrir um assunto</Botao>
      )}
    </section>
  );
}
