import Image from "next/image";
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
 * A prateleira, em duas faixas: em cima as etiquetas amarelas das caixas de
 * peça passando de lado, como passam pelos olhos de quem anda pelo corredor;
 * embaixo as marcas que a loja trabalha, com o logo de cada uma, passando no
 * sentido contrário e mais devagar — é vitrine, não prateleira.
 */
export function Prateleira() {
  return (
    <div id="prateleira" className="border-y border-azul-600/25 bg-azul-900" aria-hidden="true">
      <Faixa rotulo="Tipos de peça">
        {tipos.map((texto) => (
          <span
            key={texto}
            className="etiqueta shrink-0 rounded-sm border border-ouro/30 bg-ouro/10 px-3.5 py-2 text-ouro/85"
          >
            {texto}
          </span>
        ))}
      </Faixa>

      <div className="border-t border-azul-600/20" />

      <Faixa rotulo="Marcas" inversa copias={6}>
        {marcas.map((m) => (
          <span
            key={m.nome}
            title={m.nome}
            className="flex h-14 shrink-0 items-center rounded-md bg-creme px-5"
          >
            <Image
              src={m.logo}
              alt={m.nome}
              width={m.largura}
              height={m.altura}
              className="h-7 w-auto"
            />
          </span>
        ))}
      </Faixa>

      <p className="sr-only">
        Tipos de peça: {tipos.join(", ")}. Marcas: {marcas.map((m) => m.nome).join(", ")}.
      </p>
    </div>
  );
}

/**
 * Uma faixa que rola sem fim, com o rótulo numa coluna fixa à esquerda.
 *
 * `copias` precisa ser par: a animação anda metade da fita e recomeça, então a
 * primeira metade tem de ser idêntica à segunda. Quatro logos são pouco para
 * cobrir uma tela larga — daí as marcas repetirem mais vezes que as etiquetas.
 */
function Faixa({
  rotulo,
  inversa,
  copias = 2,
  children,
}: {
  rotulo: string;
  inversa?: boolean;
  copias?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-stretch">
      <span className="etiqueta relative z-10 flex w-32 shrink-0 items-center bg-azul-900 pl-5 text-aco/60 sm:w-44 sm:pl-8">
        {rotulo}
        <span
          className="pointer-events-none absolute inset-y-0 -right-6 w-6 bg-linear-to-r from-azul-900 to-transparent"
          aria-hidden="true"
        />
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden py-4">
        <div className={`flex w-max gap-3 ${inversa ? "marquise-inversa" : "marquise"}`}>
          {Array.from({ length: copias }, (_, volta) => (
            <div key={volta} className="flex shrink-0 items-center gap-3 pr-3">
              {children}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
