import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";
import { negocio, horarios, horaLegivel } from "@/lib/negocio";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--fonte-display",
  subsets: ["latin"],
  display: "swap",
});

const corpo = Instrument_Sans({
  variable: "--fonte-corpo",
  subsets: ["latin"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--fonte-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const site = "https://refrigeracaogarrido.com.br";
// Até 160 caracteres, com o que a pessoa busca e o que a loja é — nesta ordem.
const descricao = `Peças para geladeira, máquina de lavar e secadora no balcão, refrigeração comercial e assistência técnica. A tradição da refrigeração em Petrópolis desde ${negocio.fundacao}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    // Termo de busca primeiro, marca depois: quem procura pelo nome acha de qualquer jeito.
    default: `Peças para geladeira, máquina de lavar e secadora em Petrópolis | ${negocio.nome}`,
    template: `%s · ${negocio.nome}`,
  },
  description: descricao,
  keywords: [
    "refrigeração Petrópolis",
    "peças de geladeira Petrópolis",
    "peças de máquina de lavar Petrópolis",
    "peças de secadora Petrópolis",
    "assistência técnica máquina de lavar Petrópolis",
    "fogão industrial Petrópolis",
    "balcão refrigerado Petrópolis",
    "peças de eletrodomésticos",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site,
    siteName: negocio.nome,
    title: `${negocio.nome} — a tradição da refrigeração em Petrópolis`,
    description: descricao,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Refrigeração Garrido — peças para geladeira, máquina de lavar e secadora em Petrópolis" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: site },
};

/** Dados estruturados para o Google Business e a busca local. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: negocio.nome,
  legalName: negocio.razaoSocial,
  foundingDate: String(negocio.fundacao),
  description: descricao,
  url: site,
  image: `${site}/og.jpg`,
  telephone: negocio.telefones.map((t) => t.numero),
  email: negocio.email,
  sameAs: [negocio.instagram.url, negocio.mapa],
  address: {
    "@type": "PostalAddress",
    streetAddress: negocio.endereco.rua,
    addressLocality: negocio.endereco.cidade,
    addressRegion: negocio.endereco.uf,
    postalCode: negocio.endereco.cep,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: negocio.endereco.lat,
    longitude: negocio.endereco.lng,
  },
  openingHoursSpecification: horarios
    .filter((h) => h.abre !== null)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.dia],
      opens: horaLegivel(h.abre!).replace("h", ":").padEnd(5, "0"),
      closes: horaLegivel(h.fecha!).replace("h", ":").padEnd(5, "0"),
    })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${mono.variable} h-full`}
      // O script inline abaixo põe data-anima no <html> antes da hidratação;
      // sem isto o React acusa divergência com o HTML do servidor.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/*
          Antes do primeiro paint: se o visitante aceita movimento e a página
          não carregou rolada, marca o <html>. O CSS usa a marca para pintar a
          cena já na posição inicial (G no alto, pinguim fora) — assim o GSAP
          assume sem o logo "desmontar" na frente de quem olha. A cena toca a
          cada carga, refresh incluído. Se em 3s nada assumiu, a marca cai e a
          pose final aparece.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(window.scrollY>24)return;var h=document.documentElement;h.setAttribute("data-anima","");setTimeout(function(){h.removeAttribute("data-anima")},3000)}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
        {children}
      </body>
    </html>
  );
}
