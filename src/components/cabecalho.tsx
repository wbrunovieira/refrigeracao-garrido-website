"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LinhaDagua } from "@/components/cenario";
import { MarcaAnimada } from "@/components/marca-animada";
import { StatusLoja } from "@/components/status-loja";
import { Whatsapp } from "@/components/icones";
import { negocio, whatsapp } from "@/lib/negocio";

const secoes = [
  { id: "topo", texto: "Início" },
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
  // O indicador só aparece depois que o primeiro item entrou — senão é um
  // traço dourado sublinhando o nada.
  const [itensEntraram, setItensEntraram] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const id = window.setTimeout(() => setItensEntraram(true), 1150);
    return () => window.clearTimeout(id);
  }, []);

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
        // Nenhuma seção na faixa: acima da primeira significa Início.
        if (window.scrollY < window.innerHeight * 0.6) setAtiva("topo");
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

  // Com o menu aberto a barra também encolhe, para o painel abrir logo abaixo.
  const compacto = rolou || aberto;

  return (
    <>
    <header
      className={`barra-topo fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-verde-800
        transition-shadow duration-500 ${
          compacto
            ? "shadow-[0_1px_0_rgba(4,18,15,.06),0_10px_28px_-14px_rgba(4,18,15,.30)]"
            : "shadow-none"
        }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center gap-5 px-5 transition-[height]
          duration-500 ease-[cubic-bezier(.16,1,.3,1)] sm:px-8 ${
            compacto ? "h-23" : "h-32 sm:h-36"
          }`}
      >
        <LinhaDagua className="absolute inset-x-0 bottom-0 text-azul-marca/30" />
        <a href="#topo" className="relative mr-3 shrink-0 sm:mr-6" aria-label="Início">
          {/* Chega grande e encolhe ao rolar: a marca ganha a primeira vista
              sem custar altura de tela pelo resto da navegação. */}
          <MarcaAnimada
            modo="sempre"
            pularSeRolado
            className={`w-auto transition-[height] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
              compacto ? "h-18" : "h-22 sm:h-28"
            }`}
          />
        </a>

        <nav
          ref={navRef}
          className="relative ml-auto hidden items-center lg:flex"
          aria-label="Seções do site"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 h-0.5 rounded-full bg-ouro transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{
              transform: `translateX(${marcador.left}px)`,
              width: marcador.width,
              opacity: marcador.width && itensEntraram ? 1 : 0,
            }}
          />
          {secoes.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              ref={(el) => {
                if (el) linksRef.current.set(s.id, el);
                else linksRef.current.delete(s.id);
              }}
              aria-current={ativa === s.id ? "true" : undefined}
              style={{ "--i": i } as React.CSSProperties}
              className={`surge link-nav relative px-4 py-2 text-[15px] font-medium ${
                ativa === s.id ? "text-verde-900" : "text-tinta/75 hover:text-verde-900"
              }`}
            >
              {s.texto}
            </a>
          ))}
        </nav>

        {/* Estado da loja e ação ficam em um bloco próprio, longe da navegação. */}
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 lg:ml-6">
          <span className="surge hidden h-7 w-px bg-verde-950/15 xl:block" style={{ "--i": 5 } as React.CSSProperties} aria-hidden="true" />
          <StatusLoja className="surge hidden rounded-full border border-verde-950/18 px-3.5 py-2 xl:inline-flex" style={{ "--i": 6 } as React.CSSProperties} claro />
          {/* Em telas menores o status encurta: "Aberto até 18h30" cabe ao lado do menu.
              O WhatsApp no celular é o botão flutuante — não repete aqui. */}
          <StatusLoja
            curto
            claro
            className="surge hidden rounded-full border border-verde-950/18 px-2.5 py-1 text-[0.62rem] tracking-[0.1em] min-[390px]:inline-flex sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-[0.14em] xl:hidden"
            style={{ "--i": 6 } as React.CSSProperties}
          />
          <a
            href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido.")}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--i": 7 } as React.CSSProperties}
            className="surge surge-botao acao hidden h-11 items-center gap-2 rounded-full bg-ouro px-5 text-sm font-semibold text-tinta shadow-[inset_0_0_0_1px_rgba(10,22,19,.12)] sm:inline-flex"
          >
            <Whatsapp className="size-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="icone-circulo grid size-11 place-items-center rounded-full border border-verde-950/20 text-verde-900 lg:hidden"
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
        <div className="fixed inset-x-0 bottom-0 top-23 z-50 flex flex-col overflow-y-auto border-t border-verde-600/25 bg-verde-950 px-5 pb-10 pt-8 lg:hidden">
          <nav className="flex flex-col" aria-label="Seções do site">
            {secoes.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setAberto(false)}
                aria-current={ativa === s.id ? "true" : undefined}
                style={{ "--i": i } as React.CSSProperties}
                className={`surge surge-menu display flex items-center gap-3 border-b border-verde-600/20 py-4 text-3xl transition-colors ${
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
              href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAberto(false)}
              className="acao mt-5 flex items-center justify-center gap-2.5 rounded-full bg-ouro px-6 py-4 font-semibold text-verde-950"
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
