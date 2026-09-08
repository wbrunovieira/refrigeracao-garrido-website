import { MarcaCompletaGarrido } from "@/components/marca-svg";
import { Instagram, Whatsapp } from "@/components/icones";
import { negocio, whatsapp } from "@/lib/negocio";

const secoes = [
  { href: "#balcao", texto: "O balcão" },
  { href: "#assistencia", texto: "Assistência técnica" },
  { href: "#historia", texto: "História" },
  { href: "#visite", texto: "Visite a loja" },
];

export function Rodape() {
  return (
    <footer className="border-t border-verde-600/25 bg-verde-950 pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            {/* No rodapé a marca cabe inteira, com o pinguim e a cena de gelo. */}
            <MarcaCompletaGarrido
              className="h-auto w-64 text-ouro sm:w-72"
              titulo="Refrigeração Garrido"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-creme/60">
              Peças de reposição, refrigeração comercial, cozinha industrial e assistência
              técnica no Centro de {negocio.endereco.cidade} desde {negocio.fundacao}.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar no WhatsApp"
                className="grid size-11 place-items-center rounded-full border border-creme/20 text-creme transition-colors hover:border-ouro hover:text-ouro"
              >
                <Whatsapp className="size-5" />
              </a>
              <a
                href={negocio.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da loja"
                className="grid size-11 place-items-center rounded-full border border-creme/20 text-creme transition-colors hover:border-ouro hover:text-ouro"
              >
                <Instagram className="size-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Rodapé">
            <p className="etiqueta text-aco/50">Navegar</p>
            <ul className="mt-4 space-y-2.5">
              {secoes.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="text-sm text-creme/70 hover:text-ouro">
                    {s.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="etiqueta text-aco/50">Contato</p>
            <ul className="mt-4 space-y-2.5 font-mono text-sm text-creme/70">
              {negocio.telefones.map((t) => (
                <li key={t.numero}>
                  <a href={t.href} className="hover:text-ouro">
                    {t.numero}
                  </a>
                </li>
              ))}
              <li className="pt-2 font-sans not-italic text-creme/60">
                {negocio.endereco.rua}
                <br />
                {negocio.endereco.bairro} · {negocio.endereco.cidade}/{negocio.endereco.uf}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-verde-600/25 pt-7 text-xs text-aco/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {negocio.razaoSocial} · CNPJ {negocio.cnpj} · © {new Date().getFullYear()}
          </p>
          <p>
            Site por{" "}
            <a
              href="https://wbdigitalsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-creme/70 hover:text-ouro"
            >
              WB Digital Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
