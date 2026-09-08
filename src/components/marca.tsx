import { MarcaCompletaGarrido } from "@/components/marca-svg";

/**
 * A marca nas cores do cartão: azul-aço e grafite, sem recolorir.
 *
 * Ela foi desenhada para papel claro, então só funciona sobre creme. No topo
 * quem dá esse fundo é a própria barra; no rodapé, que é verde, a marca entra
 * montada numa placa — o mesmo arranjo do letreiro preso ao toldo.
 */
export function Marca({
  altura = "h-17",
  placa = false,
}: {
  altura?: string;
  placa?: boolean;
}) {
  const marca = (
    <MarcaCompletaGarrido className={`w-auto ${altura}`} titulo="Refrigeração Garrido" />
  );

  if (!placa) return marca;

  return (
    <span className="inline-flex items-center rounded-xl bg-creme px-6 py-4 ring-1 ring-verde-950/15 shadow-[0_10px_28px_-14px_rgba(0,0,0,.75)]">
      {marca}
    </span>
  );
}
