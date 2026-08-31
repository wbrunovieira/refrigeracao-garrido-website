/**
 * Conjunto de ícones desenhado para esta loja: geladeira, balcão, fogão
 * industrial, placa eletrônica. Traço de 1.6 no grid de 24 para que todos
 * tenham o mesmo peso ótico.
 */
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

function Base({ children, ...p }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

export function Geladeira(p: Props) {
  return (
    <Base {...p}>
      <rect x="5.5" y="2.5" width="13" height="19" rx="2.2" />
      <path d="M5.5 9.5h13" />
      <path d="M8.5 5.5v2M8.5 12v3" />
      <path d="M8 21.5v1M16 21.5v1" />
    </Base>
  );
}

export function MaquinaLavar(p: Props) {
  return (
    <Base {...p}>
      <rect x="3.5" y="2.5" width="17" height="19" rx="2.2" />
      <path d="M3.5 7h17" />
      <circle cx="12" cy="14.2" r="4.6" />
      <circle cx="12" cy="14.2" r="1.5" />
      <path d="M16.5 4.8h1.2" />
      <circle cx="7" cy="4.8" r=".6" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function BalcaoRefrigerado(p: Props) {
  return (
    <Base {...p}>
      <path d="M2.5 20.5V11l4.5-4h14.5v13.5z" />
      <path d="M7 7v13.5" />
      <path d="M11 11.5h10M11 16h10" />
      <path d="M4 20.5v2M20 20.5v2" />
    </Base>
  );
}

export function FogaoIndustrial(p: Props) {
  return (
    <Base {...p}>
      <rect x="2.5" y="6.5" width="19" height="12" rx="1.8" />
      <circle cx="8" cy="10.5" r="1.8" />
      <circle cx="16" cy="10.5" r="1.8" />
      <path d="M2.5 14.5h19" />
      <circle cx="7" cy="16.5" r=".9" />
      <circle cx="11" cy="16.5" r=".9" />
      <path d="M5 18.5v3M19 18.5v3" />
      <path d="M8 6.5V4.2M16 6.5V4.2" />
    </Base>
  );
}

export function CamaraFria(p: Props) {
  return (
    <Base {...p}>
      <rect x="3.5" y="2.5" width="17" height="19" rx="2" />
      <path d="M12 7.5v9M8.2 9.5l7.6 5M15.8 9.5l-7.6 5" />
      <path d="M17.6 12h1.5" />
    </Base>
  );
}

export function ArCondicionado(p: Props) {
  return (
    <Base {...p}>
      <rect x="2.5" y="4.5" width="19" height="7.5" rx="2" />
      <path d="M6 8.5h12" />
      <path d="M7 15.5c1.4 0 1.4 2 2.8 2M13 15.5c1.4 0 1.4 2 2.8 2M10 19c1.4 0 1.4 2 2.8 2" />
    </Base>
  );
}

export function PlacaEletronica(p: Props) {
  return (
    <Base {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M7.5 8h4v4h-4z" />
      <path d="M11.5 10h5M14 14h2.5M8 15.5h3.5" />
      <circle cx="16.5" cy="8" r="1.2" />
      <circle cx="8" cy="15.5" r=".7" fill="currentColor" stroke="none" />
      <path d="M3.5 7h-1M3.5 12h-1M20.5 15h1" />
    </Base>
  );
}

export function Panela(p: Props) {
  return (
    <Base {...p}>
      <path d="M4.5 9.5h15v6a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4z" />
      <path d="M4.5 11.5h-2M19.5 11.5h2" />
      <path d="M3 9.5h18" />
      <path d="M9.5 6.5c0-1.2 1-1.2 1-2.4M14 6.5c0-1.2 1-1.2 1-2.4" />
    </Base>
  );
}

export function Filtro(p: Props) {
  return (
    <Base {...p}>
      <path d="M8 2.5h8v3.6c0 2.8 3 3.6 3 7.4v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6c0-3.8 3-4.6 3-7.4z" />
      <path d="M5.6 12.5h12.8" />
      <path d="M12 16v3.5" />
    </Base>
  );
}

export function Ferramenta(p: Props) {
  return (
    <Base {...p}>
      <path d="M15.4 3.2a5 5 0 0 0-6.2 6.4L3.6 15.2a2.1 2.1 0 0 0 3 3l5.6-5.6a5 5 0 0 0 6.4-6.2l-3 3-2.8-.8-.8-2.8z" />
      <circle cx="5.4" cy="16.8" r=".8" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function Raio(p: Props) {
  return (
    <Base {...p}>
      <path d="M13.5 2.5 5 13.5h6l-.5 8L19 10.5h-6z" />
    </Base>
  );
}

export function Relogio(p: Props) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </Base>
  );
}

export function Pino(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 21.5s7-6.3 7-11.2A7 7 0 0 0 5 10.3c0 4.9 7 11.2 7 11.2z" />
      <circle cx="12" cy="10" r="2.6" />
    </Base>
  );
}

export function Telefone(p: Props) {
  return (
    <Base {...p}>
      <path d="M6.2 3h3l1.6 4-2 1.4a12 12 0 0 0 5.8 5.8l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.2 2 2 0 0 1 6.2 3z" />
    </Base>
  );
}

export function Seta(p: Props) {
  return (
    <Base {...p}>
      <path d="M4 12h15.5M13.5 6l6 6-6 6" />
    </Base>
  );
}

export function Whatsapp(p: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.53 3.68 1.45 5.2L2 22l5.1-1.6a9.8 9.8 0 0 0 4.94 1.32h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm0 17.9h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.97 1-3.02-.2-.31a8.1 8.1 0 0 1-1.25-4.38c0-4.5 3.67-8.16 8.19-8.16 2.19 0 4.24.85 5.79 2.4a8.1 8.1 0 0 1 2.4 5.77c0 4.5-3.67 8.16-8.16 8.16Zm4.48-6.11c-.24-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.13-.16.24-.63.79-.77.96-.14.16-.28.18-.52.06-.25-.12-1.04-.38-1.97-1.22-.73-.65-1.22-1.45-1.36-1.69-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.46-.29Z" />
    </svg>
  );
}

export function GoogleMaps(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 21.5s7-6.3 7-11.2A7 7 0 0 0 5 10.3c0 4.9 7 11.2 7 11.2z" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7.4 5.6 16.6 17" />
    </Base>
  );
}

export function Waze(p: Props) {
  return (
    <Base {...p}>
      <path d="M20.5 10.2c0 4.1-3.8 7.4-8.5 7.4-.9 0-1.7-.1-2.5-.3-1 .9-2.6 1.6-4.2 1.6.7-.7 1.2-1.6 1.3-2.5A6.9 6.9 0 0 1 3.5 10.2c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4z" />
      <circle cx="9.4" cy="9.4" r=".9" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="9.4" r=".9" fill="currentColor" stroke="none" />
      <path d="M9.6 13c.6.7 1.4 1.1 2.4 1.1s1.8-.4 2.4-1.1" />
    </Base>
  );
}

export function Estrela({ preenchida = 1, ...p }: Props & { preenchida?: number }) {
  const id = `estrela-${Math.round(preenchida * 100)}`;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${preenchida * 100}%`} stopColor="currentColor" />
          <stop offset={`${preenchida * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44l-5.81 3.06 1.1-6.47-4.7-4.58 6.51-.95z"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Instagram(p: Props) {
  return (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}
