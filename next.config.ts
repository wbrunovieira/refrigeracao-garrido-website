import type { NextConfig } from "next";

/**
 * O domínio já teve um site antes deste, em ASP, e o Google ainda conhece
 * endereços de lá (o Search Console lista sitemaps enviados em 2012). Sem
 * tratamento eles caem em 404 e o pouco de reputação que o domínio acumulou
 * se perde; com 301 a autoridade passa para a página nova.
 */
const nextConfig: NextConfig = {
  // 301 explícito (e não o 308 padrão do Next): é o código que toda ferramenta
  // de SEO e todo servidor antigo entende como "mudou de endereço para sempre".
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
