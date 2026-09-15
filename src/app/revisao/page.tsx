import type { Metadata } from "next";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./revisao.css";

// A tipografia da WB. Fica escopada nesta rota: o site da Garrido continue com a dele.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-wb" });
import { PainelRevisao } from "@/components/revisao/PainelRevisao";
import { lerEventos, reduzir, type Evento } from "@/lib/revisao";

export const metadata: Metadata = {
  title: "Revisão do site — Refrigeração Garrido",
  // Ferramenta de trabalho, não página do site: fora do Google em qualquer cenário.
  robots: { index: false, follow: false, nocache: true },
};

// O registro muda a cada clique; nada aqui pode vir de cache.
export const dynamic = "force-dynamic";

export default async function RevisaoPage() {
  let eventos: Evento[] = [];
  try {
    eventos = await lerEventos();
  } catch (e) {
    // Sem o registro a página ainda serve para abrir e conferir as páginas do site.
    console.error("[revisao] não foi possível ler o registro", e);
  }

  return (
    <div className={`wb min-h-screen bg-[var(--wb-fundo)] font-sans text-[var(--wb-tinta)] antialiased ${jakarta.variable}`} style={{ fontFamily: "var(--font-wb), ui-sans-serif, system-ui" }}>
      <header className="wb-capa">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Image
            src="/wb/logo-wb.svg"
            alt="WB Digital Solutions"
            width={207}
            height={36}
            priority
            className="h-7 w-auto brightness-0 invert"
          />
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">
            Painel de revisão · Refrigeração Garrido
          </p>
        </div>
      </header>

      <PainelRevisao eventosIniciais={eventos} situacoesIniciais={reduzir(eventos)} />

      <footer className="border-t border-[var(--wb-linha)] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 sm:px-6">
          {/* LGPD: IP é dado pessoal. O aviso vem antes de qualquer registro, não depois. */}
          <p className="font-medium text-slate-700">Sobre o registro desta revisão</p>
          <p className="mt-2 max-w-3xl leading-relaxed">
            Cada aprovação e cada pedido de alteração fica gravado com a data, a hora, o nome
            selecionado em &ldquo;quem está revisando&rdquo; e o endereço de IP de onde partiu o
            clique. Serve para que, na entrega, esteja documentado o que foi revisado e aprovado —
            e para substituir a busca no histórico do WhatsApp. Nada é apagado e nada é usado para
            outra finalidade.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-slate-400">
            <Image src="/wb/logo-wb.svg" alt="" width={207} height={36} className="h-4 w-auto opacity-60" />
            <span>
              Painel feito pela WB Digital Solutions. O site que você está revendo está em
              preview.refrigeracaogarrido.com.br, um endereço provisório — quando estiver tudo
              aprovado, ele passa a responder em refrigeracaogarrido.com.br.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
