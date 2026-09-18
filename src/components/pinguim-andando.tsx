"use client";

/**
 * O pinguim atravessa o rodapé andando.
 *
 * Reaproveita o mesmo rig e o mesmo motor de gingado da marca animada — o que
 * muda é só o percurso: em vez de chegar ao G e parar, ele entra por um lado,
 * caminha a largura toda e sai pelo outro.
 *
 * Três cuidados que valem registro:
 *
 * 1. **Só anda quando alguém está vendo.** O IntersectionObserver liga e
 *    desliga o rAF; rodapé fora da tela não gasta quadro.
 * 2. **O passo casa com o avanço.** A velocidade é derivada da largura do
 *    corpo e do ciclo (AVANCO_POR_CICLO), senão ele patina no chão.
 * 3. **Quem pediu menos movimento não vê nada.** Com `prefers-reduced-motion`
 *    o componente nem monta o laço: o pinguim fica parado, na pose do logo.
 */

import { useEffect, useRef } from "react";
import { PinguimRig } from "@/components/pinguim-rig";
import { criarGingado } from "@/lib/gingado";

/** Quanto ele avança por ciclo, em larguras de corpo. Calibrado no olho: menos
 *  que isso ele escorrega para trás, mais que isso vira corrida. */
const AVANCO_POR_CICLO = 0.9;
const CICLO = 0.78;
/** Folga antes de entrar e depois de sair, para não nascer nem sumir no corte. */
const MARGEM = 1.2;

export function PinguimAndando({ className = "" }: { className?: string }) {
  const faixa = useRef<HTMLDivElement>(null);
  const movel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caixa = faixa.current;
    const alvo = movel.current;
    if (!caixa || !alvo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gingado = criarGingado(alvo, { ciclo: CICLO });
    let quadro = 0;
    let inicio = 0;
    let andando = false;

    const passo = (agora: number) => {
      const largura = caixa.clientWidth;
      const corpo = alvo.clientWidth || 48;
      const velocidade = (corpo * AVANCO_POR_CICLO) / CICLO;
      const t = (agora - inicio) / 1000;
      const x = -corpo * MARGEM + velocidade * t;

      if (x > largura + corpo * MARGEM) {
        // Saiu do outro lado: recomeça do zero, como quem dá outra volta na loja.
        inicio = agora;
        quadro = requestAnimationFrame(passo);
        return;
      }
      alvo.style.transform = `translate3d(${x}px, 0, 0)`;
      gingado.aplicar(t, 1);
      quadro = requestAnimationFrame(passo);
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !andando) {
          andando = true;
          inicio = performance.now();
          quadro = requestAnimationFrame(passo);
        } else if (!entrada.isIntersecting && andando) {
          andando = false;
          cancelAnimationFrame(quadro);
          gingado.repouso();
        }
      },
      { threshold: 0.15 },
    );
    observador.observe(caixa);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
      gingado.repouso();
    };
  }, []);

  return (
    <div
      ref={faixa}
      aria-hidden="true"
      // Sem `relative` nem `overflow-hidden` aqui: quem usa é que posiciona a
      // faixa, e quem corta a entrada e a saída é o próprio rodapé. Ter duas
      // classes de posição no mesmo elemento deixava a faixa com altura zero.
      className={`pointer-events-none ${className}`}
    >
      {/*
        Silhueta, não o desenho do cartão: sobre o azul-escuro o grafite do
        pinguim sumiria. A tinta vira creme e o "papel" (barriga, olho, miolos)
        vira a cor do próprio fundo — o recorte é que desenha o bicho.
      */}
      <div
        ref={movel}
        // Ajuste fino para o pé encostar na linha d'água (o rig tem uma folga
        // abaixo dos pés, onde ficava o bloco de gelo).
        className="pinguim-anda absolute bottom-[-3px] left-0 w-auto will-change-transform"
        style={{ "--marca-papel": "var(--color-azul-950)" } as React.CSSProperties}
      >
        <PinguimRig className="h-24 w-auto text-creme/90 sm:h-28" />
      </div>
    </div>
  );
}
