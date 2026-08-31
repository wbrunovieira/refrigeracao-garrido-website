import { servicos } from "@/lib/catalogo";
import { Seta, Whatsapp } from "@/components/icones";
import { negocio, whatsapp } from "@/lib/negocio";

export function Assistencia() {
  return (
    <section id="assistencia" className="painel relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div data-revelar>
            <p className="etiqueta text-verde-600">Assistência técnica</p>
            <h2 className="display mt-4 text-[clamp(2.25rem,5.5vw,4rem)] text-verde-900">
              Quando a peça
              <br />
              não resolve sozinha.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-verde-800/75">
              Nem tudo é troca de peça. A gente atende residência e comércio em
              {" "}{negocio.endereco.cidade} e região — diagnóstico, conserto e instalação
              feitos por quem faz isso há décadas.
            </p>

            <a
              href={whatsapp(
                "Olá! Vim pelo site da Refrigeração Garrido e preciso de assistência técnica.\n\nEquipamento:\nProblema:\nEndereço:",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-verde-700 px-7 py-4 font-semibold text-creme transition-transform hover:scale-[1.03]"
            >
              <Whatsapp className="size-5" />
              Descrever o problema
              <Seta className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-2xl bg-verde-900/12 sm:grid-cols-2">
            {servicos.map((s, i) => (
              <li key={s.id} data-revelar data-atraso={i * 70}>
                <div className="group h-full bg-creme p-7 transition-colors hover:bg-creme-2">
                  <s.Icone className="size-8 text-verde-600 transition-colors group-hover:text-verde-700" />
                  <h3 className="display mt-5 text-xl text-verde-900">{s.nome}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-verde-800/70">
                    {s.descricao}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
