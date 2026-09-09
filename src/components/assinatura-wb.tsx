type Props = {
  className?: string;
  /** `simples` tira a moldura, para rodapés discretos. */
  variante?: "moldura" | "simples";
};

/**
 * Assinatura da WB Digital Solutions — a mesma dos outros projetos da WB,
 * portada sem lucide (o site usa ícones próprios). Herda a cor do contexto
 * via currentColor, então funciona em qualquer fundo.
 */
export function AssinaturaWB({ className = "", variante = "moldura" }: Props) {
  return (
    <div className={`flex flex-col items-center gap-2 sm:flex-row sm:gap-3 ${className}`}>
      <span className="flex items-center gap-2 text-[0.7rem] opacity-60 sm:text-xs">
        <span className="font-light">Desenvolvido com</span>
        <span className="relative inline-flex">
          <svg viewBox="0 0 24 24" className="size-3 animate-pulse fill-current sm:size-3.5" role="img" aria-label="amor">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.9 4.5c2 0 3.6 1.1 4.6 2.7 1-1.6 2.6-2.7 4.6-2.7 3.9 0 6 3.9 4.5 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
          <span aria-hidden className="absolute inset-0 animate-pulse bg-current opacity-25 blur-sm" />
        </span>
        <span className="font-light">por</span>
      </span>

      <a
        href="https://www.wbdigitalsolutions.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group/wb relative inline-flex"
      >
        <span
          aria-hidden
          className="absolute -inset-2 hidden rounded-lg bg-current opacity-0 blur-xl transition duration-500 group-hover/wb:opacity-10 sm:block"
        />
        <span
          className={`relative flex items-center gap-1.5 transition-all duration-300 sm:gap-2 ${
            variante === "moldura"
              ? "rounded-lg border border-current/20 bg-current/5 px-2 py-1 group-hover/wb:border-current/40 group-hover/wb:bg-current/10 sm:px-3 sm:py-1.5"
              : ""
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3 transition-transform duration-300 group-hover/wb:rotate-12 sm:size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
          <span className="text-[0.7rem] font-medium tracking-wide sm:text-xs">WB Digital Solutions</span>
          <svg
            viewBox="0 0 24 24"
            className="size-2.5 opacity-60 transition-all duration-300 group-hover/wb:-translate-y-0.5 group-hover/wb:translate-x-0.5 group-hover/wb:opacity-100 sm:size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </span>
      </a>
    </div>
  );
}
