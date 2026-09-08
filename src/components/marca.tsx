import { MarcaCompletaGarrido } from "@/components/marca-svg";

/**
 * A marca do cartão, inteira: pinguim, G, as duas palavras e a cena de gelo.
 * Herda a cor de quem a coloca — no fundo verde do site, sai em ouro.
 *
 * Abaixo de ~88px de altura as duas palavras deixam de ser legíveis, e é por
 * isso que a barra do topo tem 112px em vez dos 80px de praxe.
 */
export function Marca({ compacto = false }: { compacto?: boolean }) {
  return (
    <MarcaCompletaGarrido
      className={`w-auto text-ouro ${compacto ? "h-22" : "h-28"}`}
      titulo="Refrigeração Garrido"
    />
  );
}
