"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { gavetas } from "@/lib/catalogo";
import { whatsapp } from "@/lib/negocio";
import { Seta, Whatsapp } from "@/components/icones";
import { Pinguim } from "@/components/marca-elementos";

/**
 * O balcão: o visitante abre uma gaveta, marca o que precisa e o pedido vai
 * pronto para o WhatsApp. É o atendimento da loja transformado em interface.
 */
export function Balcao() {
  const [ativa, setAtiva] = useState(gavetas[0].id);
  const [pedido, setPedido] = useState<string[]>([]);

  const gaveta = gavetas.find((g) => g.id === ativa)!;

  const alternar = (item: string) =>
    setPedido((atual) =>
      atual.includes(item) ? atual.filter((i) => i !== item) : [...atual, item],
    );

  const mensagem = useMemo(() => {
    if (pedido.length === 0) {
      return `Olá! Vim pelo site e queria saber sobre ${gaveta.nome.toLowerCase()}.`;
    }
    return `Olá! Vim pelo site da Refrigeração Garrido e preciso de:\n\n${pedido
      .map((i) => `• ${i}`)
      .join("\n")}\n\nVocês têm em estoque?`;
  }, [pedido, gaveta.nome]);

  return (
    <section id="balcao" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl" data-revelar>
          <p className="etiqueta text-ouro/80">O que a gente vende</p>
          <h2 className="display mt-4 text-[clamp(2.25rem,5.5vw,4rem)] text-creme">
            Abra a gaveta,
            <br />
            monte o seu pedido.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-creme/70">
            Seis gavetas, o mesmo balcão. Marque o que você precisa e mande a lista
            pronta no WhatsApp — a gente confere o estoque e responde com preço.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-10" data-revelar data-atraso="120">
          {/* Frente do armário de peças */}
          <div className="flex flex-col gap-2">
            {gavetas.map((g, i) => {
              const selecionada = g.id === ativa;
              const marcados = g.itens.filter((item) => pedido.includes(item)).length;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setAtiva(g.id)}
                  aria-current={selecionada}
                  className={`cartao group flex items-center gap-4 rounded-xl border px-5 py-4 text-left ${
                    selecionada
                      ? "translate-x-0 border-ouro/70 bg-verde-800 lg:translate-x-3"
                      : "border-verde-600/25 bg-verde-900/50 hover:border-verde-500/50 hover:bg-verde-800/60"
                  }`}
                >
                  <g.Icone
                    className={`size-6 shrink-0 transition-colors ${
                      selecionada ? "text-ouro" : "text-aco/60 group-hover:text-creme"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="etiqueta block text-aco/50">
                      Gav. {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`block truncate font-medium ${
                        selecionada ? "text-creme" : "text-creme/80"
                      }`}
                    >
                      {g.nome}
                    </span>
                  </span>
                  {marcados > 0 && (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ouro font-mono text-xs font-bold text-verde-950">
                      {marcados}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Gaveta aberta */}
          <div className="overflow-hidden rounded-3xl border border-verde-600/35 bg-verde-900/60">
            <div className="relative h-56 sm:h-72">
              <Image
                key={gaveta.foto}
                src={gaveta.foto}
                alt={gaveta.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-verde-900 via-verde-900/40 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-5 left-6 right-6">
                <h3 className="display text-3xl text-creme sm:text-4xl">{gaveta.nome}</h3>
                <p className="mt-1.5 text-creme/70">{gaveta.resumo}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="etiqueta text-aco/60">Marque o que você precisa</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {gaveta.itens.map((item) => {
                  const marcado = pedido.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => alternar(item)}
                      aria-pressed={marcado}
                      className={`contorno rounded-full border px-4 py-2 text-sm ${
                        marcado
                          ? "border-ouro bg-ouro text-verde-950 font-semibold"
                          : "border-creme/20 text-creme/80 hover:border-ouro/60 hover:text-creme"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-verde-600/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-3 font-mono text-sm text-aco/70">
                  {/* O pinguim do logo espera enquanto não há pedido. */}
                  <Pinguim
                    className={`h-9 w-auto shrink-0 text-aco/45 transition-all duration-500 ${
                      pedido.length === 0 ? "opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                  {pedido.length === 0
                    ? "Nenhum item na lista ainda"
                    : `${pedido.length} ${pedido.length === 1 ? "item" : "itens"} na lista`}
                  {pedido.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPedido([])}
                      className="link-texto ml-3 underline underline-offset-4 hover:text-ouro"
                    >
                      limpar
                    </button>
                  )}
                </p>
                <a
                  href={whatsapp(mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acao group inline-flex items-center justify-center gap-2.5 rounded-full bg-ouro px-6 py-3.5 font-semibold text-verde-950"
                >
                  <Whatsapp className="size-5" />
                  {pedido.length === 0 ? "Perguntar no WhatsApp" : "Enviar a lista"}
                  <Seta className="seta-vai size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
