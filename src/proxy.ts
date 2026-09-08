import { NextResponse, type NextRequest } from "next/server";

/**
 * Enquanto o site não é aprovado, o domínio da loja mostra a home provisória e
 * o site inteiro vive num subdomínio, para a cliente revisar.
 *
 * A regra é por host e não por nome de subdomínio: o domínio principal (com ou
 * sem www) cai na página de construção; qualquer outro host — o subdomínio de
 * prévia, o .vercel.app, o localhost — serve o site normal.
 *
 * **Para publicar de verdade:** apagar este arquivo e a pasta
 * `src/app/em-construcao`. Não há nada além disso a desfazer.
 */
const DOMINIO = "refrigeracaogarrido.com.br";

function ehDominioPrincipal(host: string) {
  const limpo = host.split(":")[0].toLowerCase();
  return limpo === DOMINIO || limpo === `www.${DOMINIO}`;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const principal = ehDominioPrincipal(host);

  if (principal && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/em-construcao", request.url));
  }

  // Tudo que não é o domínio principal é ambiente de revisão: fora do índice.
  const resposta = NextResponse.next();
  if (!principal) {
    resposta.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return resposta;
}

export const config = {
  // Fora arquivos estáticos e imagens, que não precisam passar por aqui.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fotos|marca|.*\\.\\w+$).*)"],
};
