import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Medicao } from "@/components/medicao";
import { negocio, horarios, horaISO } from "@/lib/negocio";
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
    // Termo de busca primeiro, marca depois: quem procura pelo nome acha de
    // qualquer jeito. Até ~60 caracteres, senão o Google corta no resultado.
    default: `Peças para geladeira e máquina de lavar em Petrópolis | Garrido`,
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
    /*
     * Duas artes, e a ordem importa: o WhatsApp usa a primeira que serve, e a
     * quadrada e leve (25 KB) é a que ele mostra como prévia pequena ao lado
     * do texto. A larga fica para o Facebook, o LinkedIn e o X, que montam o
     * cartão grande. Para trocar o formato da prévia no WhatsApp, basta
     * inverter a ordem.
     */
    images: [
      { url: "/og-quadrado.jpg", width: 600, height: 600, alt: "Marca da Refrigeração Garrido — a peça está no balcão" },
      { url: "/og.jpg", width: 1200, height: 630, alt: "Refrigeração Garrido — peças para geladeira, máquina de lavar e secadora em Petrópolis" },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: site },
};

/** A barra do navegador no celular acompanha a cor da página. */
export const viewport: Viewport = {
  themeColor: "#112236",
  colorScheme: "dark",
};

/** Dados estruturados para o Google Business e a busca local. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: negocio.nome,
  legalName: negocio.razaoSocial,
  foundingDate: String(negocio.fundacao),
  description: descricao,
  "@id": `${site}/#loja`,
  url: site,
  image: [`${site}/og.jpg`, `${site}/fotos/fachada-toldo.webp`],
  logo: `${site}/marca/garrido-marca-completa.svg`,
  slogan: "A tradição da refrigeração em Petrópolis.",
  // Faixa de preço é o único campo de dinheiro que o Google pede; "$$" diz
  // "preço de bairro", que é o que a loja pratica.
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Petrópolis" },
    { "@type": "AdministrativeArea", name: "Região Serrana do Rio de Janeiro" },
  ],
  hasMap: negocio.mapa,
  // Em formato internacional: é assim que o Google casa o número com a ficha
  // do Google Business e com o discador do celular.
  telephone: [
    ...negocio.telefones.map((t) => t.href.replace("tel:", "")),
    `+${negocio.whatsapp.e164}`,
  ],
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
      opens: horaISO(h.abre!),
      closes: horaISO(h.fecha!),
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
        {/* Medição sem cookies: não pede consentimento e não identifica ninguém.
            Analytics conta visitas e cliques; Speed Insights mede o que a
            cliente e os visitantes sentem de verdade no celular deles. */}
        <Analytics />
        <Medicao />
        <SpeedInsights />
      </body>
    </html>
  );
}
