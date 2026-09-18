import type { MetadataRoute } from "next";

/** Data da última mudança de conteúdo. `new Date()` aqui mentiria: dizia ao
 *  Google que a página muda todo dia só porque o build roda de novo. */
const ATUALIZADO_EM = new Date("2026-09-18");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://refrigeracaogarrido.com.br",
      lastModified: ATUALIZADO_EM,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
