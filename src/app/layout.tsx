import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";
import { negocio, anosDeCasa, horarios, horaLegivel } from "@/lib/negocio";
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
const descricao = `Há ${anosDeCasa} anos no Centro de Petrópolis. Peças de reposição, refrigeração comercial, cozinha industrial e assistência técnica no balcão da Rua Marechal Floriano Peixoto, 192.`;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: `${negocio.nome} — Peças e assistência técnica em Petrópolis`,
    template: `%s · ${negocio.nome}`,
  },
  description: descricao,
  keywords: [
    "refrigeração Petrópolis",
    "peças de geladeira Petrópolis",
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
    title: `${negocio.nome} — desde ${negocio.fundacao} em Petrópolis`,
    description: descricao,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Refrigeração Garrido — peças e assistência técnica em Petrópolis" }],
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
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
        {children}
      </body>
    </html>
  );
}
