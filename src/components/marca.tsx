import { negocio } from "@/lib/negocio";

/**
 * Assinatura tipográfica tirada do letreiro do toldo: nome em caixa alta,
 * bem apertado, com o ano da fundação preso embaixo como na placa antiga.
 */
export function Marca({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span
        className={`display uppercase text-creme ${compacto ? "text-lg" : "text-xl"}`}
        style={{ letterSpacing: "-0.04em" }}
      >
        Refrigeração <span className="text-ouro">Garrido</span>
      </span>
      <span className="etiqueta mt-1 text-aco/55" style={{ fontSize: "0.5625rem" }}>
        Petrópolis · desde {negocio.fundacao}
      </span>
    </span>
  );
}
