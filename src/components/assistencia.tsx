import { servicos, type Servico } from "@/lib/catalogo";
import { Seta, Whatsapp } from "@/components/icones";
import { negocio, whatsapp } from "@/lib/negocio";

/**
 * A divisão entre casa e comércio não é enfeite: é a primeira coisa que
 * a pessoa quer saber ao chegar aqui — "vocês atendem o meu caso?".
 */
const grupos = [
  { chave: "residencia" as const, titulo: "Na sua casa", nota: "Atendimento residencial" },
  { chave: "comercio" as const, titulo: "No seu comércio", nota: "Bar, padaria, mercado e restaurante" },
];

function chamado(s: Servico) {
  return whatsapp(
    `Olá! Vim pelo site da Refrigeração Garrido e preciso de assistência técnica.\n\nEquipamento: ${s.nome}\nProblema:\nEndereço:`,
  );
}

function Linha({ servico }: { servico: Servico }) {
  return (
    <li className="border-t border-verde-900/10 first:border-t-0">
      <a
        href={chamado(servico)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-5 py-5 transition-[padding] duration-300 hover:pl-3"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-verde-900/6 text-verde-700 transition-colors duration-300 group-hover:bg-verde-700 group-hover:text-creme">
          <servico.Icone className="size-6" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="display block text-xl text-verde-900 sm:text-2xl">{servico.nome}</span>
          <span className="mt-1 block text-sm leading-relaxed text-verde-800/65">
            {servico.descricao}
          </span>
        </span>

        <span className="etiqueta hidden shrink-0 items-center gap-2 text-verde-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex">
          Chamar
          <Seta className="size-4" />
        </span>
      </a>
    </li>
  );
}

export function Assistencia() {
  return (
    <section id="assistencia" className="painel relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
          {/* Coluna fixa: o argumento fica à vista enquanto a lista rola. */}
          <div className="lg:sticky lg:top-28 lg:self-start" data-revelar>
            <p className="etiqueta text-azul-marca">Assistência técnica</p>
            <h2 className="display mt-4 text-[clamp(2.25rem,5vw,3.5rem)] text-verde-900">
              Quando a peça
              <br />
              não resolve sozinha.
            </h2>
            <p className="mt-6 leading-relaxed text-verde-800/75">
              Nem tudo é troca de peça. A gente atende residência e comércio em{" "}
              {negocio.endereco.cidade} e região — diagnóstico, conserto e instalação
              feitos por quem faz isso há décadas.
            </p>

            <a
              href={whatsapp(
                "Olá! Vim pelo site da Refrigeração Garrido e preciso de assistência técnica.\n\nEquipamento:\nProblema:\nEndereço:",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-verde-700 px-7 py-4 font-semibold text-creme transition-transform hover:scale-[1.03]"
            >
              <Whatsapp className="size-5" />
              Descrever o problema
              <Seta className="size-4 transition-transform group-hover:translate-x-1" />
            </a>

            <p className="mt-8 border-t border-verde-900/10 pt-6 text-sm leading-relaxed text-verde-800/55">
              Toque em um equipamento ao lado e o WhatsApp já abre com o chamado
              começado.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {grupos.map((g, i) => (
              <div key={g.chave} data-revelar data-atraso={i * 120}>
                <div className="flex items-baseline gap-4">
                  <h3 className="display text-lg text-verde-900">{g.titulo}</h3>
                  <span className="h-px flex-1 bg-verde-900/15" aria-hidden="true" />
                  <span className="etiqueta text-verde-800/45">{g.nota}</span>
                </div>

                <ul className="mt-2">
                  {servicos
                    .filter((s) => s.publico === g.chave)
                    .map((s) => (
                      <Linha key={s.id} servico={s} />
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
