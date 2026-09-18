import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança.
 *
 * A política de conteúdo (CSP) é a peça central: ela lista de onde o navegador
 * pode carregar cada coisa e, com isso, um script injetado por terceiro
 * simplesmente não roda. Ela é permissiva em dois pontos, por necessidade real:
 *
 * - `'unsafe-inline'` em script: o Next põe os dados da página em scripts
 *   inline e o site tem o script que evita o piscar da animação. Sem nonce em
 *   página estática, não há como apertar mais sem quebrar.
 * - `'unsafe-inline'` em estilo: o Tailwind e as animações escrevem estilo
 *   direto no elemento.
 *
 * Mesmo assim sobram as travas que mais valem: nada de plugin, ninguém pode
 * embutir o site num iframe, formulário não sai para fora e o mapa do Google é
 * o único terceiro autorizado a aparecer numa moldura.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // O beacon da Cloudflare e o script de medição (servido do próprio domínio).
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  // O mapa da seção "Visite a loja".
  "frame-src https://www.google.com https://maps.google.com",
  "upgrade-insecure-requests",
].join("; ");

const CABECALHOS = [
  // Um ano de HTTPS obrigatório, subdomínios inclusive. Sem `preload` de
  // propósito: entrar na lista dos navegadores é fácil e sair leva meses.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Content-Security-Policy", value: CSP },
  // Nada de adivinhar tipo de arquivo: .txt não vira script por acidente.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Ao sair para o WhatsApp ou o Maps, mandamos o domínio, nunca a URL cheia.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // O site não usa câmera, microfone nem localização: fica negado para todos.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

/**
 * O domínio já teve um site antes deste, em ASP, e o Google ainda conhece
 * endereços de lá (o Search Console lista sitemaps enviados em 2012). Sem
 * tratamento eles caem em 404 e o pouco de reputação que o domínio acumulou
 * se perde; com 301 a autoridade passa para a página nova.
 */
const nextConfig: NextConfig = {
  // 301 explícito (e não o 308 padrão do Next): é o código que toda ferramenta
  // de SEO e todo servidor antigo entende como "mudou de endereço para sempre".
  async headers() {
    return [{ source: "/:caminho*", headers: CABECALHOS }];
  },

  async redirects() {
    return [
      { source: "/nossa-historia.html", destination: "/#historia", statusCode: 301 },
      { source: "/index.asp", destination: "/", statusCode: 301 },
      { source: "/default.asp", destination: "/", statusCode: 301 },
      { source: "/index.htm", destination: "/", statusCode: 301 },
      { source: "/index.html", destination: "/", statusCode: 301 },
      // Qualquer outra página do site antigo: o conteúdo dela não existe mais,
      // e a home é o lugar honesto para chegar.
      { source: "/:pagina(.*\\.(?:asp|aspx|html|htm|php))", destination: "/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
