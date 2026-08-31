import { GoogleMaps, Waze } from "@/components/icones";
import { negocio } from "@/lib/negocio";

const destino = encodeURIComponent(
  `${negocio.nome}, ${negocio.endereco.rua}, ${negocio.endereco.bairro}, ${negocio.endereco.cidade} ${negocio.endereco.uf}`,
);

const rotas = [
  {
    nome: "Google Maps",
    href: `https://www.google.com/maps/dir/?api=1&destination=${destino}`,
    Icone: GoogleMaps,
    // Azul da rota do Google e ciano da marca do Waze.
    classes: "hover:border-[#1A73E8] hover:bg-[#1A73E8] hover:text-white",
  },
  {
    nome: "Waze",
    href: `https://waze.com/ul?ll=${negocio.endereco.lat},${negocio.endereco.lng}&navigate=yes`,
    Icone: Waze,
    classes: "hover:border-[#33CCFF] hover:bg-[#33CCFF] hover:text-[#052B38]",
  },
];

/** Abrir rota no app que a pessoa já usa. Cada botão veste a cor do seu app no hover. */
export function BotoesRota({ escuro = false }: { escuro?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {rotas.map((r) => (
        <a
          key={r.nome}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-semibold transition-colors duration-300 ${
            escuro
              ? "border-creme/25 text-creme"
              : "border-verde-900/15 bg-creme text-verde-900"
          } ${r.classes}`}
        >
          <r.Icone className="size-4.5" />
          {r.nome}
        </a>
      ))}
    </div>
  );
}
