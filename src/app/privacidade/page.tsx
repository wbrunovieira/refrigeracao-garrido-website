import type { Metadata } from "next";
import Link from "next/link";
import { Marca } from "@/components/marca";
import { Seta } from "@/components/icones";
import { negocio } from "@/lib/negocio";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "O que este site coleta, o que não coleta e com quem falar sobre isso. Refrigeração Garrido, Petrópolis.",
  alternates: { canonical: "/privacidade" },
};

export const revalidate = 86400;

/**
 * Página de privacidade em português de gente, não de jurídico.
 *
 * O site não tem formulário, não tem login e não usa cookie: a medição da
 * Vercel conta visitas sem identificar ninguém. Dizer isso em cinco parágrafos
 * honestos vale mais — e cumpre a LGPD melhor — do que copiar um modelo de
 * três páginas que fala de coisas que não acontecem aqui.
 */
export default function Privacidade() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <Link href="/" className="inline-block">
        <Marca altura="h-20" />
      </Link>

      <p className="etiqueta mt-14 text-ouro/80">Privacidade</p>
      <h1 className="display mt-4 text-[clamp(2rem,5vw,3rem)] text-creme">
        O que este site sabe
        <br />
        sobre você.
      </h1>

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-creme/75">
        <p>
          Quase nada, e é de propósito. Este site não tem cadastro, não tem
          formulário e não pede nenhum dado seu. Você não precisa aceitar nada
          para navegar porque não há cookie de rastreamento aqui.
        </p>

        <h2 className="display pt-4 text-2xl text-creme">O que é contado</h2>
        <p>
          Guardamos uma contagem de visitas e de cliques nos botões (WhatsApp,
          telefone, rota, avaliação, Instagram), feita pela Vercel, que hospeda
          o site. Essa contagem é anônima: não identifica quem clicou, não usa
          cookie e não permite montar um perfil seu. Serve para a loja saber se
          o site está ajudando alguém a chegar até ela.
        </p>

        <h2 className="display pt-4 text-2xl text-creme">Quando você fala com a loja</h2>
        <p>
          Os botões levam para o WhatsApp, para o telefone ou para o mapa. A
          partir daí a conversa acontece fora deste site: no WhatsApp, valem as
          regras da Meta; no mapa, as do Google. O que você escrever para a loja
          fica com a loja, e é usado só para responder o seu atendimento.
        </p>

        <h2 className="display pt-4 text-2xl text-creme">Serviços de terceiros</h2>
        <p>
          O mapa da página de visita é um quadro do Google Maps, que carrega
          direto do Google. A hospedagem é da Vercel e a entrega passa pela
          Cloudflare — as duas registram acessos nos próprios sistemas, como
          qualquer servidor faz, para funcionar e se proteger de ataque.
        </p>

        <h2 className="display pt-4 text-2xl text-creme">Seus direitos</h2>
        <p>
          A LGPD garante a você pedir acesso, correção ou exclusão dos seus
          dados. Como aqui não guardamos dado pessoal nenhum, na prática não há
          o que corrigir ou apagar — mas se você falou com a loja e quer que
          aquela conversa seja apagada, é só pedir:{" "}
          <a
            href={`mailto:${negocio.email}`}
            className="link-texto text-creme hover:text-ouro"
          >
            {negocio.email}
          </a>{" "}
          ou {negocio.telefones[0].numero}.
        </p>

        <p className="text-base text-aco/75">
          {negocio.razaoSocial} · CNPJ {negocio.cnpj} · {negocio.endereco.rua},{" "}
          {negocio.endereco.bairro}, {negocio.endereco.cidade}/{negocio.endereco.uf}.
        </p>
      </div>

      <Link
        href="/"
        className="contorno contorno-ouro mt-14 inline-flex items-center gap-2.5 rounded-full border border-creme/20 px-7 py-4 font-medium text-creme"
      >
        Voltar para o site
        <Seta className="seta-vai size-4" />
      </Link>
    </main>
  );
}
