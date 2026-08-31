import { marcas } from "@/lib/catalogo";

const tipos = [
  "Placas eletrônicas",
  "Compressores",
  "Termostatos",
  "Capacitores",
  "Rolamentos",
  "Gás refrigerante",
  "Filtros secadores",
  "Resistências",
  "Retentores",
  "Correias",
];

/**
 * A prateleira: as etiquetas amarelas das caixas de peça passando de lado,
 * do jeito que passam pelos olhos de quem anda pelo corredor da loja.
 */
export function Prateleira() {
  const fita = [...marcas, ...tipos];

  return (
    <div
      className="relative overflow-hidden border-y border-verde-600/25 bg-verde-900/70 py-5"
      aria-hidden="true"
    >
      <div className="marquise flex w-max gap-3">
        {[0, 1].map((volta) => (
          <div key={volta} className="flex shrink-0 gap-3 pr-3">
            {fita.map((texto) => (
              <span
                key={`${volta}-${texto}`}
                className="etiqueta shrink-0 rounded-sm border border-ouro/30 bg-ouro/10 px-3.5 py-2 text-ouro/85"
              >
                {texto}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">
        Marcas e tipos de peça disponíveis: {fita.join(", ")}.
      </p>
    </div>
  );
}
