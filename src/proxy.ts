import { NextResponse, type NextRequest } from "next/server";

/**
 * Roteamento por host.
 *
 * O site está publicado no domínio da loja. O que sobra aqui são duas regras:
 *
 * 1. **www vai para o domínio sem www** (308, preserva caminho e método): o
 *    conteúdo é o mesmo e o Google não precisa escolher entre duas versões.
 * 2. **Qualquer outro host é ambiente de trabalho** — o subdomínio de prévia
 *    que a cliente usa para revisar e os endereços .vercel.app — e sai do
 *    índice por cabeçalho, não por arquivo, porque o robots.txt é um só.
 */
const DOMINIO = "refrigeracaogarrido.com.br";

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  if (host === `www.${DOMINIO}`) {
    const destino = new URL(request.url);
    destino.host = DOMINIO;
    return NextResponse.redirect(destino, 308);
  }

  const resposta = NextResponse.next();
  if (host !== DOMINIO) {
    resposta.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return resposta;
}

export const config = {
  // Fora arquivos estáticos e imagens, que não precisam passar por aqui.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fotos|marca|marcas|.*\\.\\w+$).*)"],
};
