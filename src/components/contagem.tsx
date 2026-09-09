"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Número que conta de zero até o valor quando entra na tela. Uma vez só.
 * No servidor e com prefers-reduced-motion mostra o valor final direto.
 */
export function Contagem({ ate, duracao = 1600, className }: { ate: number; duracao?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(ate);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / duracao);
        const suave = 1 - Math.pow(1 - t, 4);            // desacelera no fim, como quem chega
        setValor(Math.round(ate * suave));
        if (t < 1) raf = requestAnimationFrame(passo);
      };
      setValor(0);
      raf = requestAnimationFrame(passo);
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [ate, duracao]);

  return <span ref={ref} className={className}>{valor}</span>;
}
