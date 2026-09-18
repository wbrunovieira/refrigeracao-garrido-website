import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/animacao"] },
    sitemap: "https://refrigeracaogarrido.com.br/sitemap.xml",
    host: "refrigeracaogarrido.com.br",
  };
}
