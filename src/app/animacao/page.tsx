"use client";

import { useCallback, useRef, useState } from "react";
import { MarcaAnimada, type Cena } from "@/components/marca-animada";

/**
 * Laboratório da animação. Fica fora do índice (o proxy marca noindex em
 * qualquer host que não seja o principal, e o principal serve a construção).
 * ?p=0.42 congela a timeline nesse ponto — é como os quadros são capturados.
 */
export default function Laboratorio() {
  const cena = useRef<Cena | null>(null);
  const [dur, setDur] = useState(0);
  const [pausado, setPausado] = useState(false);

  // ?p= é lido aqui, no callback, e não num efeito: nada de setState em efeito.
  const aoPronta = useCallback((c: Cena) => {
    cena.current = c;
    setDur(c.duration());
    const v = new URLSearchParams(window.location.search).get("p");
    if (v !== null) c.progress(Number(v));
  }, []);

  // Barra de espaço pausa/continua, para congelar no defeito e tirar o print.
  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key !== " ") return;
    e.preventDefault();
    const c = cena.current; if (!c) return;
    if (c.paused()) { c.play(); setPausado(false); } else { c.pause(); setPausado(true); }
  };

  return (
    <main className="min-h-dvh bg-creme px-8 py-10 text-tinta outline-none" tabIndex={0} onKeyDown={aoTeclar}>
      <p className="etiqueta text-azul-marca">Laboratório · etapa 3</p>
      <h1 className="display mt-2 text-3xl text-verde-900">A chegada e o encaixe do G</h1>

      <div className="mt-10 w-[640px] max-w-full">
        <MarcaAnimada modo="sempre" aoPronta={aoPronta} />
      </div>

      <p className="mt-3 font-mono text-xs text-verde-800/50">espaço também pausa e continua</p>
      <div className="mt-6 flex items-center gap-4 font-mono text-sm">
        <button
          type="button"
          onClick={() => { cena.current?.restart(); setPausado(false); }}
          className="rounded-full border border-verde-900/30 px-5 py-2 hover:border-verde-600"
        >
          repetir
        </button>
        <button
          type="button"
          onClick={() => {
            const c = cena.current; if (!c) return;
            if (c.paused()) { c.play(); setPausado(false); } else { c.pause(); setPausado(true); }
          }}
          className="rounded-full bg-verde-700 px-5 py-2 text-creme hover:bg-verde-600"
        >
          {pausado ? "continuar" : "pausar"}
        </button>
        <label className="flex items-center gap-3">
          scrub
          <input
            type="range" min={0} max={1} step={0.005} defaultValue={0}
            onInput={(e) => cena.current?.progress(Number(e.currentTarget.value))}
            className="w-72"
          />
        </label>
        <span className="text-verde-800/60">duração {dur.toFixed(2)}s</span>
      </div>
    </main>
  );
}
