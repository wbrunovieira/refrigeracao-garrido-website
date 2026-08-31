/**
 * Dados reais da Refrigeração Garrido.
 * Fonte: perfil @refrigeracaogarrido, fachada da loja e listas públicas.
 * Confirmar com a cliente antes de publicar: telefones, WhatsApp e horários.
 */

export const negocio = {
  nome: "Refrigeração Garrido",
  razaoSocial: "Refrigeração Garrido Ltda",
  cnpj: "31.173.768/0001-90",
  fundacao: 1971,
  chamada: "Peças, equipamentos e assistência técnica em Petrópolis",
  endereco: {
    rua: "Rua Marechal Floriano Peixoto, 192",
    bairro: "Centro",
    cidade: "Petrópolis",
    uf: "RJ",
    cep: "25610-081",
    lat: -22.5064684,
    lng: -43.1683773,
  },
  telefones: [
    { rotulo: "Loja", numero: "(24) 2242-5548", href: "tel:+552422425548" },
    { rotulo: "Loja", numero: "(24) 2242-5341", href: "tel:+552422425341" },
  ],
  whatsapp: { numero: "(24) 98151-2696", e164: "5524981512696" },
  instagram: { handle: "@refrigeracaogarrido", url: "https://www.instagram.com/refrigeracaogarrido/" },
  mapa: "https://www.google.com/maps?cid=618575051065636225",
  /** Lido no perfil do Google em agosto de 2026. Reconferir de tempos em tempos. */
  google: { nota: 4.2, avaliacoes: 112 },
} as const;

export const anosDeCasa = new Date().getFullYear() - negocio.fundacao;

/** 0 = domingo. Minutos desde a meia-noite. */
export const horarios = [
  { dia: 0, rotulo: "Domingo", abre: null, fecha: null },
  { dia: 1, rotulo: "Segunda", abre: 540, fecha: 1110 },
  { dia: 2, rotulo: "Terça", abre: 540, fecha: 1110 },
  { dia: 3, rotulo: "Quarta", abre: 540, fecha: 1110 },
  { dia: 4, rotulo: "Quinta", abre: 540, fecha: 1110 },
  { dia: 5, rotulo: "Sexta", abre: 540, fecha: 1110 },
  { dia: 6, rotulo: "Sábado", abre: 540, fecha: 780 },
] as const;

export function horaLegivel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

/** Link de WhatsApp com a mensagem já escrita. */
export function whatsapp(mensagem: string) {
  return `https://wa.me/${negocio.whatsapp.e164}?text=${encodeURIComponent(mensagem)}`;
}
