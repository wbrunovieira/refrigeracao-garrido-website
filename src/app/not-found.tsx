import type { Metadata } from "next";
import Link from "next/link";
import { MarcaCompletaGarrido } from "@/components/marca-svg";
import { Seta, Whatsapp } from "@/components/icones";
import { negocio, whatsapp } from "@/lib/negocio";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * O endereço não existe — o que acontece bastante aqui, porque o domínio já
 * teve um site antigo e o Google ainda conhece páginas dele que os 301 não
 * cobrem. Em vez de um beco sem saída, os dois caminhos que resolvem: voltar
 * para a loja ou perguntar direto no WhatsApp.
 */
export default function NaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      <MarcaCompletaGarrido className="h-28 w-auto sm:h-32" titulo={negocio.nome} />

      <p className="etiqueta mt-12 text-ouro/80">Erro 404</p>
      <h1 className="display mt-4 text-[clamp(2rem,6vw,3.5rem)] text-creme">
        Essa página não está
        <br />
        na prateleira.
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-creme/70">
        O endereço que você abriu não existe mais. A peça que você procura,
        essa a gente provavelmente tem.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="acao group inline-flex items-center gap-2.5 rounded-full bg-ouro px-7 py-4 font-semibold text-azul-950"
        >
          Voltar para a loja
          <Seta className="seta-vai size-4" />
        </Link>
        <a
          href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido.")}
          target="_blank"
          rel="noopener noreferrer"
          className="contorno contorno-ouro inline-flex items-center gap-2.5 rounded-full border border-creme/20 px-7 py-4 font-medium text-creme"
        >
          <Whatsapp className="size-4" />
          Perguntar no WhatsApp
        </a>
      </div>
    </main>
  );
}
