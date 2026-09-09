import { Estrela, Seta } from "@/components/icones";
import { negocio } from "@/lib/negocio";

/** Nota pública do perfil da loja no Google. Sempre com link para a origem. */
export function NotaGoogle({ escuro = false }: { escuro?: boolean }) {
  const { nota, avaliacoes } = negocio.google;

  return (
    <a
      href={negocio.mapa}
      target="_blank"
      rel="noopener noreferrer"
      className={`contorno group inline-flex items-center gap-3 rounded-full border px-5 py-3 ${
        escuro
          ? "contorno-verde border-verde-900/15 bg-creme"
          : "contorno-ouro border-creme/20 bg-verde-900/60"
      }`}
    >
      <span className="flex gap-0.5 text-ouro" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Estrela key={i} className="size-4" preenchida={Math.min(1, Math.max(0, nota - i + 1))} />
        ))}
      </span>
      <span className={`text-sm leading-snug ${escuro ? "text-verde-900" : "text-creme"}`}>
        <strong className="font-semibold">{nota.toLocaleString("pt-BR")}</strong> no Google
        <span className={`whitespace-nowrap ${escuro ? "text-verde-800/60" : "text-creme/55"}`}> · {avaliacoes} avaliações</span>
      </span>
      <Seta
        className={`seta-vai size-4 ${
          escuro ? "text-verde-600" : "text-ouro"
        }`}
      />
    </a>
  );
}
