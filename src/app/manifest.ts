import type { MetadataRoute } from "next";
import { negocio } from "@/lib/negocio";

/**
 * Para quem salva o site na tela de início do celular: nome curto, o pinguim
 * como ícone e as cores da loja. O `maskable` é uma segunda arte com folga em
 * volta, porque o Android recorta o ícone no formato do aparelho — sem ela, o
 * bico do pinguim ficaria de fora.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${negocio.nome} — peças e assistência técnica`,
    short_name: negocio.nome,
    description:
      "Peças para geladeira, máquina de lavar e secadora, refrigeração comercial e assistência técnica no Centro de Petrópolis.",
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    background_color: "#112236",
    theme_color: "#112236",
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icone-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
