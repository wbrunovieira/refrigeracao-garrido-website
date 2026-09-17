import { Estrela, Seta } from "@/components/icones";
import { negocio } from "@/lib/negocio";

/**
 * Convite para avaliar no Google. A nota não aparece: o que vende é a
 * experiência de quem avalia, não a média.
 */
export function AvalieNoGoogle({ escuro = false }: { escuro?: boolean }) {
  return (
    <a
      href={negocio.google.avaliar}
      target="_blank"
      rel="noopener noreferrer"
      className={`contorno group inline-flex items-center gap-3 rounded-full border px-5 py-3 ${
        escuro ? "contorno-azul border-azul-900/15 bg-creme" : "contorno-ouro border-creme/20 bg-azul-900/60"
      }`}
    >
      <span className="flex gap-0.5 text-ouro" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => <Estrela key={i} className="size-4" preenchida={1} />)}
      </span>
      <span className={`text-sm leading-snug ${escuro ? "text-azul-900" : "text-creme"}`}>
        Avalie a gente no Google
      </span>
      <Seta className={`seta-vai size-4 ${escuro ? "text-azul-600" : "text-ouro"}`} />
    </a>
  );
}
