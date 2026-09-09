import Image from "next/image";
import { Contagem } from "@/components/contagem";
import { anosDeCasa, negocio } from "@/lib/negocio";

/** Números que a própria loja pode comprovar — nada estimado. */
const fatos: { valor: string; rotulo: string; conta?: number }[] = [
  { valor: String(negocio.fundacao), rotulo: "Ano de fundação" },
  { valor: String(anosDeCasa()), rotulo: "Anos no mesmo Centro", conta: anosDeCasa() },
  { valor: "Seg–Sáb", rotulo: "Loja aberta ao público" },
];

export function Historia() {
  return (
    <section id="historia" className="relative overflow-hidden py-24 sm:py-32">
      <div className="aura absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <div className="foto-chega relative aspect-4/3 overflow-hidden rounded-[2rem] border border-verde-600/40" data-revelar>
            <Image
              src="/fotos/equipe-fachada.webp"
              alt="Equipe da Refrigeração Garrido na porta da loja, sob o letreiro"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
          <div className="foto-chega relative -mt-10 ml-6 mr-2 aspect-3/2 overflow-hidden rounded-2xl border border-verde-600/40 sm:ml-16 sm:w-2/3" data-revelar data-atraso="220">
            <Image
              src="/fotos/equipe-balcao.webp"
              alt="Atendimento no balcão da loja, conferindo peças em uma caixa"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="etiqueta text-ouro/80" data-revelar>Desde {negocio.fundacao}</p>
          <h2 className="display mt-4 text-[clamp(2.25rem,5.5vw,4rem)] text-creme" data-revelar data-atraso="80">
            Meio século
            <br />
            atrás do mesmo balcão.
          </h2>

          <blockquote className="risco-cresce relative mt-8 pl-6" data-revelar data-atraso="220">
            <p className="text-lg leading-relaxed text-creme/80">
              “Construímos essa história com trabalho sério, compromisso e paixão pelo que
              fazemos. Cada conserto, cada instalação, cada atendimento — tudo é feito com o
              cuidado de quem valoriza a confiança que recebemos ao longo de todos esses anos.”
            </p>
            <footer className="etiqueta mt-4 text-aco/60">
              A própria loja, no perfil {negocio.instagram.handle}
            </footer>
          </blockquote>

          <p className="mt-7 max-w-xl leading-relaxed text-creme/70" data-revelar data-atraso="340">
            A Garrido abriu em {negocio.fundacao} e nunca saiu do Centro de{" "}
            {negocio.endereco.cidade}. Quem entra hoje encontra o mesmo arranjo de sempre:
            estoque de verdade nas prateleiras, gente que conhece a peça pelo nome e um
            atendimento que não empurra o que você não precisa.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-verde-600/30 pt-8">
            {fatos.map((f, i) => (
              <div key={f.rotulo} className="flex flex-col-reverse gap-2" data-revelar data-atraso={420 + i * 90}>
                <dt className="etiqueta text-aco/55">{f.rotulo}</dt>
                <dd className="display text-2xl text-ouro sm:text-3xl">
                  {/* o número de anos conta até o valor: é o dado que mais impressiona */}
                  {f.conta ? <Contagem ate={f.conta} /> : f.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
