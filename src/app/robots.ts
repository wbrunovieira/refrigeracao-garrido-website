import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/revisao", "/api/"] },
    sitemap: "https://refrigeracaogarrido.com.br/sitemap.xml",
  };
}
