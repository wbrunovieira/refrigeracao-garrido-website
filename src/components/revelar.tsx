"use client";

import { useEffect } from "react";

/**
 * Liga a revelação no scroll para todo elemento com [data-revelar].
 * Marca <html> para que, sem JavaScript, nada fique escondido.
 */
export function AtivarRevelacao() {
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.add("js-ativo");

    const alvos = document.querySelectorAll<HTMLElement>("[data-revelar]");
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const el = entrada.target as HTMLElement;
          const atraso = Number(el.dataset.atraso ?? 0);
          window.setTimeout(() => el.setAttribute("data-revelar", "visivel"), atraso);
          observador.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    alvos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  return null;
}
