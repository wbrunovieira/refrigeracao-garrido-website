import Image from "next/image";
import { StatusLoja } from "@/components/status-loja";
import { Pino, Seta, Whatsapp } from "@/components/icones";
import { anosDeCasa, negocio, whatsapp } from "@/lib/negocio";

export function Heroi() {
  return (
    <section id="topo" className="relative isolate overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-28">
      <div className="aura absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hachura absolute inset-0 -z-10 opacity-40" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div className="entrada">
          <p className="etiqueta flex items-center gap-2 text-ouro/80">
            <Pino className="size-3.5" />
            {negocio.endereco.rua} · {negocio.endereco.bairro}, {negocio.endereco.cidade}
          </p>

          <h1 className="display mt-6 text-[clamp(3rem,9vw,6.5rem)] text-creme">
            Quebrou?
            <br />
            A peça está
            <br />
            <span className="acende text-ouro">no balcão.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-creme/75">
            Há {anosDeCasa} anos no Centro de Petrópolis, vendendo peça de reposição,
            refrigeração comercial e equipamento de cozinha industrial — e consertando
            o que dá para consertar. Você descreve o problema, a gente acha a peça.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={whatsapp(
                "Olá! Vim pelo site da Refrigeração Garrido. Preciso de ajuda com:",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-ouro to-ouro-claro px-7 py-4 font-semibold text-verde-950 shadow-[0_10px_40px_-12px] shadow-ouro/60 transition-transform hover:scale-[1.03]"
            >
              <Whatsapp className="size-5" />
              Falar no WhatsApp
              <Seta className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            {/* Leva ao bloco de visita, onde ficam Google Maps, Waze e horário. */}
            <a
              href="#visite"
              className="inline-flex items-center gap-2.5 rounded-full border border-creme/25 px-7 py-4 font-medium text-creme transition-colors hover:border-ouro hover:text-ouro"
            >
              Como chegar
            </a>
          </div>

          <StatusLoja className="mt-8 inline-flex" />
        </div>

        <div className="relative">
          {/* O toldo é a marca da loja: entra como a primeira imagem da página. */}
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-verde-600/40">
            <Image
              src="/fotos/fachada-toldo.webp"
              alt="Fachada da Refrigeração Garrido com o toldo verde e o letreiro amarelo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-verde-950 via-verde-950/25 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Os telefones estão pintados no toldo desde sempre. */}
          <div className="vidro absolute -bottom-6 left-4 right-4 rounded-2xl p-5 sm:left-8 sm:right-auto sm:w-72">
            <p className="etiqueta text-ouro/80">Como no letreiro</p>
            <div className="mt-3 space-y-1.5">
              {negocio.telefones.map((t) => (
                <a
                  key={t.numero}
                  href={t.href}
                  className="block font-mono text-lg text-creme transition-colors hover:text-ouro"
                >
                  {t.numero}
                </a>
              ))}
            </div>
          </div>

          <div className="vidro absolute -top-5 right-2 rounded-2xl px-5 py-4 text-right sm:right-6">
            <p className="display text-4xl text-ouro">{anosDeCasa}</p>
            <p className="etiqueta mt-1 text-creme/70">anos de balcão</p>
          </div>
        </div>
      </div>
    </section>
  );
}
