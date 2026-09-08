import type { Metadata } from "next";
import { Marca } from "@/components/marca";
import { LinhaDagua } from "@/components/cenario";
import { StatusLoja } from "@/components/status-loja";
import { Instagram, Pino, Relogio, Telefone, Whatsapp } from "@/components/icones";
import { anosDeCasa, horaLegivel, horarios, negocio, whatsapp } from "@/lib/negocio";

export const metadata: Metadata = {
  // absolute: sem isso o template do layout repetiria o nome da loja.
  title: { absolute: `${negocio.nome} — site em construção` },
  description: `Loja de peças, equipamentos e assistência técnica em refrigeração no Centro de ${negocio.endereco.cidade} desde ${negocio.fundacao}. O site está sendo preparado; enquanto isso, fale com a gente.`,
  // Página provisória: não deve ser indexada como se fosse a home da loja.
  robots: { index: false, follow: false },
};

/**
 * Home provisória enquanto o site definitivo é aprovado.
 *
 * Não é uma página morta de "em construção": quem chegar aqui é cliente
 * procurando a loja, então ela entrega o essencial — telefone, WhatsApp,
 * endereço e horário.
 */
export default function EmConstrucao() {
  return (
    <main className="painel relative flex min-h-dvh flex-col items-center justify-center px-5 py-20">
      <LinhaDagua className="absolute inset-x-0 top-8 text-azul-marca/25" />
      <LinhaDagua className="absolute inset-x-0 bottom-8 text-azul-marca/25" />

      <div className="w-full max-w-2xl text-center">
        <Marca altura="h-32 sm:h-40" />

        <p className="etiqueta mt-10 text-azul-marca">Site em construção</p>
        <h1 className="display mt-4 text-[clamp(1.9rem,4.5vw,3rem)] text-verde-900">
          A loja continua aberta.
        </h1>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-verde-800/75">
          Estamos preparando o site novo. Enquanto isso, é só chamar — há{" "}
          {anosDeCasa} anos no mesmo balcão, no Centro de {negocio.endereco.cidade}.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsapp("Olá! Preciso falar com a Refrigeração Garrido.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-ouro px-7 py-4 font-semibold text-tinta shadow-[inset_0_0_0_1px_rgba(10,22,19,.12)] transition-transform hover:scale-[1.03]"
          >
            <Whatsapp className="size-5" />
            Falar no WhatsApp
          </a>
          <a
            href={negocio.mapa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-verde-900/20 px-7 py-4 font-medium text-verde-900 transition-colors hover:border-verde-600"
          >
            <Pino className="size-4.5" />
            Como chegar
          </a>
        </div>

        <dl className="mx-auto mt-12 grid max-w-xl gap-6 border-t border-verde-900/12 pt-8 text-left sm:grid-cols-3">
          <div>
            <dt className="etiqueta flex items-center gap-2 text-verde-800/50">
              <Telefone className="size-3.5" /> Telefone
            </dt>
            <dd className="mt-2 space-y-1">
              {negocio.telefones.map((t) => (
                <a
                  key={t.numero}
                  href={t.href}
                  className="block font-mono text-sm text-verde-900 hover:text-verde-600"
                >
                  {t.numero}
                </a>
              ))}
            </dd>
          </div>
          <div>
            <dt className="etiqueta flex items-center gap-2 text-verde-800/50">
              <Pino className="size-3.5" /> Endereço
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-verde-900">
              {negocio.endereco.rua}
              <br />
              {negocio.endereco.bairro} · {negocio.endereco.cidade}/{negocio.endereco.uf}
            </dd>
          </div>
          <div>
            <dt className="etiqueta flex items-center gap-2 text-verde-800/50">
              <Relogio className="size-3.5" /> Horário
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-verde-900">
              Seg a sex, {horaLegivel(horarios[1].abre!)} às {horaLegivel(horarios[1].fecha!)}
              <br />
              Sáb, {horaLegivel(horarios[6].abre!)} às {horaLegivel(horarios[6].fecha!)}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex items-center justify-center gap-6">
          <StatusLoja className="inline-flex" claro />
          <a
            href={negocio.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-verde-800/70 hover:text-verde-600"
          >
            <Instagram className="size-4" />
            {negocio.instagram.handle}
          </a>
        </div>
      </div>
    </main>
  );
}
