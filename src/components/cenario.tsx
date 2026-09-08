import { Icebergs } from "@/components/marca-elementos";

/**
 * A cena do logo emprestada à página: a água marca as divisas entre as faixas
 * claras e escuras, e os icebergs viram horizonte ao fundo do herói.
 *
 * A dose é baixa de propósito. São elementos de ambientação — quem tem que
 * chamar atenção é o título e o botão de WhatsApp.
 */

/** Divisa entre faixas: os riscos d'água do logo, correndo devagar. */
export function LinhaDagua({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`linha-dagua mareja pointer-events-none h-4 w-full ${className}`}
    />
  );
}

/** Horizonte de icebergs, bem apagado, ao pé de uma seção escura. */
export function HorizonteIcebergs({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
    >
      <Icebergs className="h-auto w-full min-w-[820px] text-verde-500/12" />
    </div>
  );
}
