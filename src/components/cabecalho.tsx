"use client";

import { useEffect, useState } from "react";
import { Marca } from "@/components/marca";
import { StatusLoja } from "@/components/status-loja";
import { Whatsapp } from "@/components/icones";
import { whatsapp } from "@/lib/negocio";

const secoes = [
  { href: "#balcao", texto: "O balcão" },
  { href: "#assistencia", texto: "Assistência" },
  { href: "#historia", texto: "História" },
  { href: "#visite", texto: "Visite a loja" },
];

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        rolou || aberto
          ? "bg-verde-950/88 backdrop-blur-xl border-b border-verde-600/30"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <a href="#topo" className="shrink-0" aria-label="Início">
          <Marca compacto />
        </a>

        <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Seções do site">
          {secoes.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="text-sm text-creme/70 transition-colors hover:text-ouro"
            >
              {s.texto}
            </a>
          ))}
        </nav>

        <StatusLoja className="ml-auto hidden xl:inline-flex lg:ml-0" />

        <a
          href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido e preciso de uma peça.")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-ouro px-5 py-2.5 text-sm font-semibold text-verde-950 transition-transform hover:scale-[1.03] sm:inline-flex"
        >
          <Whatsapp className="size-4" />
          WhatsApp
        </a>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="ml-auto grid size-10 shrink-0 place-items-center rounded-full border border-verde-600/40 text-creme lg:hidden"
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all ${
                aberto ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all ${
                aberto ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {aberto && (
        <div className="border-t border-verde-600/25 bg-verde-950/95 px-5 pb-8 pt-6 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Seções do site">
            {secoes.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setAberto(false)}
                className="display py-2 text-2xl text-creme"
              >
                {s.texto}
              </a>
            ))}
          </nav>
          <StatusLoja className="mt-6 inline-flex" />
        </div>
      )}
    </header>
  );
}
