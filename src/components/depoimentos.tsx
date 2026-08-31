/**
 * Depoimentos reais, recolhidos de avaliações públicas e do Instagram da loja.
 * Substituir pelas avaliações do Google assim que o perfil for conectado.
 */
const depoimentos = [
  {
    texto:
      "Por duas vezes entrei em contato com a Garrido e tive excelente atendimento e resultados. Ambos os profissionais que me atenderam, para manutenção de geladeira e máquina de lavar roupas, de excelente nível, comprometimento e honestidade.",
    autor: "Cliente da loja",
    origem: "Avaliação pública",
  },
  {
    texto: "Parabéns pela iniciativa!!! São 50 anos de trabalho sério. Deus os abençoe!",
    autor: "@robsongarrido1957",
    origem: "Comentário no Instagram",
  },
  {
    texto: "Ótima empresa no ramo de refrigeração.",
    autor: "Cliente da loja",
    origem: "Avaliação pública",
  },
];

import { NotaGoogle } from "@/components/nota-google";

export function Depoimentos() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6" data-revelar>
          <div className="max-w-xl">
            <p className="etiqueta text-ouro/80">Quem já passou por aqui</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-creme">
              O que dizem no balcão e fora dele.
            </h2>
          </div>
          <NotaGoogle />
        </div>

        <ul className="mt-12 grid items-start gap-5 md:grid-cols-3">
          {depoimentos.map((d, i) => (
            <li
              key={d.texto}
              data-revelar
              data-atraso={i * 90}
              className="rounded-2xl border border-verde-600/30 bg-verde-900/50 p-7"
            >
              <span className="display text-5xl leading-none text-ouro/40" aria-hidden="true">
                “
              </span>
              <p className="mt-3 leading-relaxed text-creme/80">{d.texto}</p>
              <footer className="mt-6 border-t border-verde-600/25 pt-4">
                <p className="font-medium text-creme">{d.autor}</p>
                <p className="etiqueta mt-1 text-aco/50">{d.origem}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
