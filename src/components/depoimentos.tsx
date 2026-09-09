import { Estrela, Seta } from "@/components/icones";
import { negocio } from "@/lib/negocio";

/**
 * Só depoimento de cliente, com nome e origem conferidos na fonte. Ficaram de
 * fora um elogio de amigo do dono e um comentário da própria família no
 * Instagram — reais, mas não são clientes. As do Google vieram copiadas do
 * perfil da loja (Bruno, 09/2026); o Google não dá acesso por API.
 */
const destaque = {
  texto:
    "Por duas vezes entrei em contato com a Garrido e tive excelente atendimento e resultados. Ambos os profissionais que me atenderam, para manutenção de geladeira e máquina de lavar roupas, de excelente nível, comprometimento e honestidade. Recomendo!",
  autor: "Anita Soares",
  origem: "Avaliação no Apontador, 2017",
  estrelas: 5,
};

const curtos = [
  { texto: "Ótimo atendimento, excelentes preços!!", autor: "Nathan Azevedo", origem: "Avaliação no Google", estrelas: 5 },
  { texto: "Melhor loja do ramo!!!", autor: "Dino Carlos", origem: "Local Guide · avaliação no Google", estrelas: 5 },
  { texto: "Uma das lojas mais completas da cidade.", autor: "Janaína Bastos", origem: "Local Guide · avaliação no Google", estrelas: 5 },
];

function Estrelas({ n, className = "size-4" }: { n: number; className?: string }) {
  return (
    <div className="flex gap-0.5 text-ouro" aria-label={`${n} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Estrela key={i} className={className} preenchida={i <= n ? 1 : 0} />
      ))}
    </div>
  );
}

export function Depoimentos() {
  return (
    <section id="depoimentos" className="relative overflow-hidden py-24 sm:py-28">
      {/* um sopro de luz: o verde da página num canto, o azul da marca no outro */}
      <div className="brilho-depoimentos absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl" data-revelar>
          <p className="etiqueta text-ouro/80">Quem já passou por aqui</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-creme">
            O que dizem no balcão e fora dele.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <figure
            data-revelar
            data-atraso={120}
            className="relative rounded-3xl border border-verde-600/30 bg-verde-900/50 p-8 sm:p-10 lg:col-span-2"
          >
            <span
              className="aspas display absolute -top-3 left-7 text-7xl leading-none text-ouro/45"
              aria-hidden="true"
            >
              “
            </span>
            <Estrelas n={destaque.estrelas} />
            <blockquote className="mt-5 text-lg leading-relaxed text-creme/85 sm:text-xl">
              {destaque.texto}
            </blockquote>
            <figcaption className="mt-6 border-t border-verde-600/25 pt-4">
              <p className="font-medium text-creme">{destaque.autor}</p>
              <p className="etiqueta mt-1 text-aco/50">{destaque.origem}</p>
            </figcaption>
          </figure>

          {/* o convite: mais útil para a loja do que qualquer média */}
          <div
            data-revelar
            data-atraso={240}
            className="flex flex-col justify-between rounded-3xl border border-ouro/30 bg-linear-to-br from-ouro/12 to-transparent p-8 sm:p-10"
          >
            <div>
              <Estrelas n={5} className="size-5" />
              <h3 className="display mt-5 text-2xl text-creme sm:text-3xl">
                Teve uma boa experiência com a gente?
              </h3>
              <p className="mt-3 leading-relaxed text-creme/70">
                Conta no Google. Leva um minuto e ajuda quem ainda não conhece a loja a
                chegar até aqui.
              </p>
            </div>
            <a
              href={negocio.google.avaliar}
              target="_blank"
              rel="noopener noreferrer"
              className="acao group mt-8 inline-flex w-fit items-center gap-2.5 rounded-full bg-ouro px-6 py-3.5 font-semibold text-verde-950"
            >
              Avaliar no Google
              <Seta className="seta-vai size-4" />
            </a>
          </div>

          {curtos.map((d, i) => (
            <figure
              key={d.autor}
              data-revelar
              data-atraso={360 + i * 90}
              className="relative rounded-3xl border border-verde-600/30 bg-verde-900/40 p-7"
            >
              <span
                className="aspas display absolute -top-2 left-6 text-5xl leading-none text-ouro/40"
                aria-hidden="true"
              >
                “
              </span>
              <Estrelas n={d.estrelas} />
              <blockquote className="mt-4 text-lg leading-snug text-creme/85">{d.texto}</blockquote>
              <figcaption className="mt-5">
                <p className="font-medium text-creme">{d.autor}</p>
                <p className="etiqueta mt-1 text-aco/50">{d.origem}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
