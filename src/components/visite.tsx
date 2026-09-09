import { BotoesRota } from "@/components/botoes-rota";
import { LinhaDagua } from "@/components/cenario";
import { AvalieNoGoogle } from "@/components/nota-google";
import { StatusLoja } from "@/components/status-loja";
import { Instagram, Pino, Relogio, Telefone, Whatsapp } from "@/components/icones";
import { horaLegivel, horarios, negocio, whatsapp } from "@/lib/negocio";

const enderecoCompleto = `${negocio.endereco.rua} — ${negocio.endereco.bairro}, ${negocio.endereco.cidade}/${negocio.endereco.uf}`;

export function Visite() {
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(
    `${negocio.nome}, ${enderecoCompleto}`,
  )}&z=17&output=embed`;

  return (
    <section id="visite" className="painel relative py-24 sm:py-32">
      <LinhaDagua className="absolute inset-x-0 top-6 text-azul-marca/25" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6" data-revelar>
          <div className="max-w-2xl">
            <p className="etiqueta text-azul-marca">Visite a loja</p>
            <h2 className="display mt-4 text-[clamp(2.25rem,5.5vw,4rem)] text-verde-900">
              Fica no Centro,
              <br />
              embaixo do toldo verde.
            </h2>
          </div>
          <AvalieNoGoogle escuro />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="flex flex-col gap-6" data-revelar>
            <div className="rounded-2xl border border-verde-900/12 bg-creme p-7">
              <p className="etiqueta flex items-center gap-2 text-verde-600">
                <Pino className="size-3.5" /> Endereço
              </p>
              <p className="mt-3 text-xl leading-snug text-verde-900">
                {negocio.endereco.rua}
                <br />
                {negocio.endereco.bairro} · {negocio.endereco.cidade}/{negocio.endereco.uf}
                <br />
                <span className="font-mono text-base text-verde-800/70">
                  CEP {negocio.endereco.cep}
                </span>
              </p>
              <p className="etiqueta mt-6 text-verde-800/45">Traçar rota</p>
              <div className="mt-3">
                <BotoesRota />
              </div>
            </div>

            <div className="rounded-2xl border border-verde-900/12 bg-creme p-7">
              <p className="etiqueta flex items-center gap-2 text-verde-600">
                <Relogio className="size-3.5" /> Horário
              </p>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {horarios.map((h) => (
                    <tr key={h.dia} className="border-b border-verde-900/8 last:border-0">
                      <th scope="row" className="py-2 text-left font-medium text-verde-900">
                        {h.rotulo}
                      </th>
                      <td className="py-2 text-right font-mono text-verde-800/75">
                        {h.abre == null || h.fecha == null
                          ? "Fechado"
                          : `${horaLegivel(h.abre)} – ${horaLegivel(h.fecha)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 rounded-lg bg-verde-900/6 px-3 py-2">
                <StatusLoja className="inline-flex" claro />
              </div>
            </div>

            <div className="rounded-2xl border border-verde-900/12 bg-creme p-7">
              <p className="etiqueta flex items-center gap-2 text-verde-600">
                <Telefone className="size-3.5" /> Contato
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {negocio.telefones.map((t) => (
                  <a
                    key={t.numero}
                    href={t.href}
                    className="link-texto font-mono text-lg text-verde-900 hover:text-verde-600"
                  >
                    {t.numero}
                  </a>
                ))}
                <a
                  href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acao-verde inline-flex w-fit items-center gap-2.5 rounded-full bg-verde-700 px-5 py-3 text-sm font-semibold text-creme"
                >
                  <Whatsapp className="size-4" />
                  {negocio.whatsapp.numero}
                </a>
                <a
                  href={negocio.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto inline-flex w-fit items-center gap-2 text-sm text-verde-800/80 hover:text-verde-600"
                >
                  <Instagram className="size-4" />
                  {negocio.instagram.handle}
                </a>
                <a
                  href={`mailto:${negocio.email}`}
                  className="link-texto w-fit font-mono text-sm text-verde-800/80 hover:text-verde-600"
                >
                  {negocio.email}
                </a>
              </div>
            </div>
          </div>

          <div
            className="min-h-96 overflow-hidden rounded-2xl border border-verde-900/12 lg:min-h-full"
            data-revelar
            data-atraso="120"
          >
            <iframe
              title={`Mapa com a localização da ${negocio.nome}`}
              src={mapa}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-96"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
