"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Marca } from "@/components/marca";
import { StatusLoja } from "@/components/status-loja";
import { Whatsapp } from "@/components/icones";
import { negocio, whatsapp } from "@/lib/negocio";

const secoes = [
  { id: "balcao", texto: "O balcão" },
  { id: "assistencia", texto: "Assistência" },
  { id: "historia", texto: "História" },
  { id: "visite", texto: "Visite a loja" },
];

const { telefones } = negocio;

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [ativa, setAtiva] = useState<string | null>(null);
  const [marcador, setMarcador] = useState({ left: 0, width: 0 });

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Seção em foco: a última que cruzou a faixa superior da janela.
  useEffect(() => {
    const alvos = secoes
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observador = new IntersectionObserver(
      (entradas) => {
        const visiveis = entradas.filter((e) => e.isIntersecting);
        if (visiveis.length > 0) {
          const topo = visiveis.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setAtiva(topo.target.id);
          return;
        }
        // Nenhuma seção na faixa: acima da primeira significa herói.
        if (window.scrollY < window.innerHeight * 0.6) setAtiva(null);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );

    alvos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  // O marcador acompanha o link ativo medindo a posição real dele.
  const posicionar = useCallback(() => {
    const nav = navRef.current;
    const link = ativa ? linksRef.current.get(ativa) : undefined;
    if (!nav || !link) {
      setMarcador((m) => ({ ...m, width: 0 }));
      return;
    }
    setMarcador({
      left: link.offsetLeft - nav.clientLeft,
      width: link.offsetWidth,
    });
  }, [ativa]);

  useEffect(() => {
    posicionar();
    window.addEventListener("resize", posicionar);
    return () => window.removeEventListener("resize", posicionar);
  }, [posicionar]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        rolou || aberto
          ? "bg-verde-950/88 backdrop-blur-xl border-b border-verde-600/30"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-5 sm:px-8">
        <a href="#topo" className="shrink-0" aria-label="Início">
          <Marca compacto />
        </a>

        <nav
          ref={navRef}
          className="relative ml-auto hidden items-center lg:flex"
          aria-label="Seções do site"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 rounded-full bg-ouro/12 ring-1 ring-ouro/35 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{
              transform: `translateX(${marcador.left}px)`,
              width: marcador.width,
              opacity: marcador.width ? 1 : 0,
            }}
          />
          {secoes.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              ref={(el) => {
                if (el) linksRef.current.set(s.id, el);
                else linksRef.current.delete(s.id);
              }}
              aria-current={ativa === s.id ? "true" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                ativa === s.id ? "text-ouro" : "text-creme/70 hover:text-creme"
              }`}
            >
              {s.texto}
            </a>
          ))}
        </nav>

        {/* Estado da loja e ação ficam em um bloco próprio, longe da navegação. */}
        <div className="ml-auto flex shrink-0 items-center gap-4 lg:ml-6">
          <span className="hidden h-7 w-px bg-verde-600/35 xl:block" aria-hidden="true" />
          <StatusLoja className="hidden rounded-full border border-verde-600/40 bg-verde-900/60 px-3.5 py-2 xl:inline-flex" />
          <a
            href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido e preciso de uma peça.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-ouro px-5 py-2.5 text-sm font-semibold text-verde-950 transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Whatsapp className="size-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-verde-600/40 text-creme lg:hidden"
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
      </div>

    </header>

      {aberto && (
        <div className="fixed inset-x-0 bottom-0 top-20 z-50 flex flex-col overflow-y-auto border-t border-verde-600/25 bg-verde-950 px-5 pb-10 pt-8 lg:hidden">
          <nav className="flex flex-col" aria-label="Seções do site">
            {secoes.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setAberto(false)}
                aria-current={ativa === s.id ? "true" : undefined}
                className={`display flex items-center gap-3 border-b border-verde-600/20 py-4 text-3xl transition-colors ${
                  ativa === s.id ? "text-ouro" : "text-creme"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-7 w-0.5 rounded-full transition-colors ${
                    ativa === s.id ? "bg-ouro" : "bg-transparent"
                  }`}
                />
                {s.texto}
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <StatusLoja className="inline-flex rounded-full border border-verde-600/40 bg-verde-900/60 px-3.5 py-2" />
            <a
              href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido e preciso de uma peça.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAberto(false)}
              className="mt-5 flex items-center justify-center gap-2.5 rounded-full bg-ouro px-6 py-4 font-semibold text-verde-950"
            >
              <Whatsapp className="size-5" />
              Falar no WhatsApp
            </a>
            <div className="mt-5 flex flex-col gap-1.5">
              {telefones.map((t) => (
                <a key={t.numero} href={t.href} className="font-mono text-sm text-creme/60">
                  {t.numero}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
