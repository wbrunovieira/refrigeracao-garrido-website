import { MarcaCompletaGarrido } from "@/components/marca-svg";

/**
 * A marca nas cores do cartão, montada sobre uma placa creme.
 *
 * É o arranjo da própria fachada: o letreiro é um painel claro preso ao toldo
 * verde. Sem a placa, o grafite do pinguim desapareceria no fundo escuro —
 * o creme já é cor da paleta do site, então a marca entra sem ruído.
 */
export function Marca({ compacto = false }: { compacto?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl bg-creme ring-1 ring-verde-950/15
        shadow-[0_10px_28px_-14px_rgba(0,0,0,.75)] ${compacto ? "px-4 py-2" : "px-6 py-4"}`}
    >
      <MarcaCompletaGarrido
        className={`w-auto ${compacto ? "h-20" : "h-24"}`}
        titulo="Refrigeração Garrido"
      />
    </span>
  );
}
