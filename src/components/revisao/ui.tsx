"use client";

/**
 * Peças de interface do painel de revisão.
 *
 * Ficam separadas porque a decisão que elas carregam é uma só e vale para a tela inteira:
 * **hierarquia**. Antes cada botão era escrito à mão no lugar onde aparecia, e o resultado é o
 * que o cliente viu — aprovar, pedir alteração e abrir a página com o mesmo peso, um do lado
 * do outro, sem nada dizendo qual é o caminho principal. Com um componente só de botão, a
 * hierarquia deixa de depender de disciplina e passa a ser estrutural.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LADO, type Autor, type Situacao } from "@/lib/revisao";

export const NOME_CLIENTE = "a Garrido";
export const NOME_AGENCIA = "WB Digital Solutions";

/** O nome do select não cabe num botão nem numa frase. "Bruno (WB)" e "Garrido" bastam. */
export function apelido(a: Autor) {
  if (LADO[a] === "agencia") return `${a.split(" ")[0]} (WB)`;
  return a.replace(/^Refrigeração /, "");
}

/**
 * O estado do modelo (`Situacao`) é absoluto: diz de que lado da mesa está a bola.
 * O **tom** é relativo a quem está lendo, e é ele quem decide o barulho visual.
 *
 * Essa é a troca central do redesenho. Antes "com a agência" era vermelho para todo mundo — e
 * vermelho, lido pelo dona da loja, significa erro, quando na verdade significa "pode
 * relaxar, é conosco". Numa lista de cartões só uma coisa pode gritar: o que espera por
 * quem está olhando agora. Todo o resto tem de ser silencioso.
 */
export type Tom = "silencio" | "voce" | "eles" | "aprovado" | "pronto";

export function tom(s: Situacao, souAgencia: boolean): Tom {
  if (s === "novo") return "silencio";
  if (s === "fechado") return "pronto";
  if (s === "aprovado") return "aprovado";
  return s === (souAgencia ? "com-agencia" : "com-cliente") ? "voce" : "eles";
}

export function rotulo(s: Situacao, souAgencia: boolean): string {
  switch (tom(s, souAgencia)) {
    case "silencio":
      return "Ainda não olhada";
    case "voce":
      // Nomear o lado em vez de "você": o mesmo cartão é lido pelos dois, e o rótulo
      // relativo obrigava o leitor a lembrar quem estava selecionado no topo.
      return souAgencia ? "Esperando a WB" : `Esperando ${NOME_CLIENTE}`;
    case "eles":
      return souAgencia ? `Esperando ${NOME_CLIENTE}` : "Esperando a WB";
    case "aprovado":
      return souAgencia ? "Aprovado pelo cliente" : "Você aprovou";
    case "pronto":
      return "Pronto";
  }
}

/** Selo de estado. Só existe quando há o que dizer — "ainda não olhada" é ausência, não selo. */
const SELO: Record<Tom, string> = {
  silencio: "",
  voce: "bg-[var(--wb-ambar)] text-[var(--wb-ambar-tinta)] ring-[var(--wb-ambar-borda)]",
  eles: "bg-[var(--wb-roxo-leve)] text-[var(--wb-roxo)] ring-[var(--wb-roxo-borda)]",
  aprovado: "bg-[var(--wb-verde-leve)] text-[var(--wb-verde-tinta)] ring-emerald-300",
  pronto: "bg-[var(--wb-verde)] text-white ring-[var(--wb-verde)]",
};

export const PONTO: Record<Tom, string> = {
  silencio: "bg-[var(--wb-lilas)]",
  voce: "bg-[var(--wb-ambar-borda)]",
  eles: "bg-[var(--wb-roxo-vivo)]",
  aprovado: "bg-emerald-400",
  pronto: "bg-[var(--wb-verde)]",
};

/** A faixa lateral do cartão. Transparente em tudo que não exige ação de quem lê. */
export const TRILHO: Record<Tom, string> = {
  silencio: "transparent",
  voce: "var(--wb-ambar-borda)",
  eles: "transparent",
  aprovado: "var(--wb-verde-leve)",
  pronto: "var(--wb-verde)",
};

export function Selo({ situacao, souAgencia }: { situacao: Situacao; souAgencia: boolean }) {
  const t = tom(situacao, souAgencia);
  // Sem selo no estado silencioso. O ponto do cartão continua narrando para o leitor de tela.
  if (t === "silencio") return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ring-1 ${SELO[t]}`}
    >
      {t === "pronto" && (
        <svg viewBox="0 0 12 12" aria-hidden className="size-3">
          <path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {rotulo(situacao, souAgencia)}
    </span>
  );
}

/**
 * Botão.
 *
 * O peso diz a IMPORTÂNCIA (preenchido = a ação da vez, contorno = alternativa, texto = saída)
 * e a cor diz o SIGNIFICADO. As duas coisas separadas, porque foi misturá-las que deixou a
 * tela confusa:
 *
 * - `aprovar`    — verde. **Só aprovação usa verde**, em qualquer lugar da tela. Se o verde
 *                  também servisse para "Responder", ele deixaria de significar "está certo" e
 *                  o cliente aprovaria no automático achando que estava respondendo.
 * - `sim`        — o mesmo verde, em contorno: aprovar quando não é a ação da vez.
 * - `destaque`   — roxo da WB. Ação principal que não é aprovação (responder, agradecer, abrir).
 * - `atencao`    — âmbar. Ação da agência sobre um pedido em aberto ("já arrumei").
 * - `secundario` — alternativa legítima, contorno neutro.
 * - `discreto`   — cancelar, voltar atrás, abrir e fechar. Texto, sem caixa.
 * - `saida`      — sair para o site. Ganha contorno roxo porque é o primeiro passo de tudo e
 *                  estava como um link de texto de 18px de altura.
 *
 * `min-h-11` é 44px, o mínimo de alvo de toque. Não há botão abaixo disso nesta tela.
 */
type Peso = "aprovar" | "sim" | "destaque" | "atencao" | "secundario" | "discreto" | "saida";

const PESO: Record<Peso, string> = {
  aprovar:
    "bg-[var(--wb-verde)] text-white shadow-[0_10px_24px_-14px_rgba(4,120,87,0.9)] hover:bg-[var(--wb-verde-tinta)] active:translate-y-px",
  sim: "bg-white text-[var(--wb-verde-tinta)] ring-1 ring-emerald-300 hover:bg-[var(--wb-verde-leve)] hover:ring-[var(--wb-verde)] active:translate-y-px",
  destaque:
    "bg-[var(--wb-roxo)] text-white shadow-[0_10px_24px_-14px_rgba(53,5,69,0.9)] hover:bg-[var(--wb-roxo-vivo)] active:translate-y-px",
  atencao:
    "bg-[var(--wb-ambar-borda)] text-[var(--wb-ambar-tinta)] shadow-[0_10px_24px_-14px_rgba(232,160,43,0.9)] hover:bg-[#d18e1d] active:translate-y-px",
  secundario:
    "bg-white text-[var(--wb-tinta-2)] ring-1 ring-[var(--wb-linha)] hover:ring-[var(--wb-lilas)] hover:text-[var(--wb-roxo)] active:translate-y-px",
  discreto: "text-[var(--wb-tinta-3)] hover:bg-black/5 hover:text-[var(--wb-tinta)]",
  saida:
    "bg-white text-[var(--wb-roxo)] ring-1 ring-[var(--wb-roxo-borda)] hover:bg-[var(--wb-roxo-leve)] active:translate-y-px",
};

export function Botao({
  peso = "secundario",
  largo,
  ocupado,
  children,
  className = "",
  ...resto
}: {
  peso?: Peso;
  /** No celular a ação principal ocupa a linha inteira; no desktop volta ao tamanho do texto. */
  largo?: boolean;
  ocupado?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...resto}
      disabled={resto.disabled || ocupado}
      aria-busy={ocupado || undefined}
      className={`wb-foco inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-[background-color,box-shadow,transform,color] duration-150 disabled:cursor-not-allowed disabled:opacity-55 ${
        largo ? "w-full sm:w-auto" : ""
      } ${PESO[peso]} ${className}`}
    >
      {ocupado && <Girando />}
      {children}
    </button>
  );
}

/** Botão que na verdade é link — mesma altura e mesmo peso visual do botão de saída. */
export function LinkSaida({
  href,
  children,
  largo,
}: {
  href: string;
  children: ReactNode;
  largo?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wb-foco inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 text-[15px] font-semibold transition-[background-color,transform] duration-150 ${
        largo ? "w-full sm:w-auto" : ""
      } ${PESO.saida}`}
    >
      {children}
      <svg viewBox="0 0 14 14" aria-hidden className="size-3.5">
        <path d="M5 2h7v7M12 2L4 10M9 12H2V5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">(abre em outra aba)</span>
    </a>
  );
}

function Girando() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4 animate-spin">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M14 8a6 6 0 0 0-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Aviso de falha, do tamanho de um recado.
 *
 * Antes o erro virava um parágrafo no topo do documento — às vezes sete telas acima do botão
 * que falhou, isto é, invisível. Agora ele nasce colado no botão, e diz o que fazer em vez de
 * repetir a mensagem técnica da API.
 */
export function Aviso({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-[14px] leading-snug text-red-900 ring-1 ring-red-200"
    >
      <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 size-4 shrink-0">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4.2M8 11.2v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

/** "há 3 dias", "ontem", "agora há pouco" — ninguém lê 03/09/2026, 10:12 e sente a distância. */
export function haQuanto(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 2) return "agora há pouco";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} ${h === 1 ? "hora" : "horas"}`;
  const d = Math.round(h / 24);
  if (d === 1) return "ontem";
  if (d < 30) return `há ${d} dias`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/** Data completa, para o `title`: a auditoria precisa dela, a leitura corrida não. */
export function dataCompleta(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
