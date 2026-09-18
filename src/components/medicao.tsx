"use client";

/**
 * Medição dos cliques que valem dinheiro para a loja.
 *
 * Um ouvinte só, no documento inteiro, em vez de instrumentar cada botão: os
 * links de WhatsApp aparecem em sete lugares, e espalhar chamadas de medição
 * por eles faria o código do site conhecer a ferramenta de análise. Aqui a
 * regra é o destino do link, e a seção sai do `id` do bloco onde ele está —
 * então o relatório diz *de onde* a pessoa chamou a loja.
 *
 * Sem cookies e sem identificar ninguém: é contagem de evento, não rastreio.
 */

import { useEffect } from "react";
import { track } from "@vercel/analytics";

const REGRAS: [RegExp, string][] = [
  [/wa\.me/, "whatsapp"],
  [/search\.google\.com\/local\/writereview/, "avaliar-no-google"],
  [/instagram\.com/, "instagram"],
  [/waze\.com/, "rota-waze"],
  [/google\.com\/maps/, "rota-maps"],
];

export function Medicao() {
  useEffect(() => {
    const aoClicar = (evento: MouseEvent) => {
      const alvo = evento.target;
      if (!(alvo instanceof Element)) return;
      const link = alvo.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const nome = href.startsWith("tel:")
        ? "telefone"
        : REGRAS.find(([padrao]) => padrao.test(href))?.[1];
      if (!nome) return;

      const secao = link.closest("section[id], footer[id], header")?.id || "sem-secao";
      track(nome, { secao });
    };

    // Na captura: assim o registro acontece mesmo que algum componente
    // interrompa o clique antes de ele subir a árvore.
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
