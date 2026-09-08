"use client";

import { useSyncExternalStore } from "react";
import { horarios, horaLegivel } from "@/lib/negocio";

/** Hora de Petrópolis, independente do fuso de quem visita. */
function chaveDoMinuto() {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const pegar = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const dia = dias.indexOf(pegar("weekday").toLowerCase().slice(0, 3));
  return `${dia}:${Number(pegar("hour")) * 60 + Number(pegar("minute"))}`;
}

function assinar(avisar: () => void) {
  const id = window.setInterval(avisar, 60_000);
  return () => window.clearInterval(id);
}

function calcular(chave: string) {
  const [dia, minutos] = chave.split(":").map(Number);
  const hoje = horarios.find((h) => h.dia === dia);

  if (hoje?.abre != null && hoje.fecha != null && minutos >= hoje.abre && minutos < hoje.fecha) {
    return { aberto: true, texto: `Aberto agora · fecha às ${horaLegivel(hoje.fecha)}` };
  }
  if (hoje?.abre != null && minutos < hoje.abre) {
    return { aberto: false, texto: `Fechado · abre hoje às ${horaLegivel(hoje.abre)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const proximo = horarios.find((h) => h.dia === (dia + i) % 7);
    if (proximo?.abre != null) {
      const quando = i === 1 ? "amanhã" : proximo.rotulo.toLowerCase();
      return { aberto: false, texto: `Fechado · abre ${quando} às ${horaLegivel(proximo.abre)}` };
    }
  }
  return { aberto: false, texto: "Fechado" };
}

export function StatusLoja({
  className = "",
  claro = false,
}: {
  className?: string;
  /** Sobre fundo claro o ouro não tem contraste; o verde assume. */
  claro?: boolean;
}) {
  // O horário só existe no navegador: no servidor o snapshot é nulo e a
  // marcação sai neutra, sem divergência de hidratação.
  const chave = useSyncExternalStore(assinar, chaveDoMinuto, () => null);

  if (!chave) {
    return (
      <span className={`etiqueta ${claro ? "text-verde-800/60" : "text-aco/60"} ${className}`}>
        Horário da loja
      </span>
    );
  }

  const estado = calcular(chave);

  return (
    <span className={`items-center gap-2 etiqueta ${className}`}>
      <span
        className={`ponto-vivo size-2 rounded-full ${
          estado.aberto ? (claro ? "bg-verde-500" : "bg-ouro") : claro ? "bg-verde-800/35" : "bg-aco/50"
        }`}
        aria-hidden="true"
      />
      <span
        className={
          estado.aberto
            ? claro
              ? "text-verde-700"
              : "text-ouro-claro"
            : claro
              ? "text-verde-800/70"
              : "text-aco/80"
        }
      >
        {estado.texto}
      </span>
    </span>
  );
}
