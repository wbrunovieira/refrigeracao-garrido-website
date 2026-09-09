/**
 * Dados reais da Refrigeração Garrido.
 * Fontes: o cartão de visita da loja (CNPJ, inscrições, e-mail, telefones,
 * endereço, o que vende e conserta), o perfil @refrigeracaogarrido, a fachada
 * e listas públicas. Ainda por confirmar com a cliente: WhatsApp e horários.
 */

/** "5524981512696" -> "(24) 98151-2696"; "552422425548" -> "(24) 2242-5548". */
function formataBR(e164: string) {
  const local = e164.replace(/\D/g, "").replace(/^55/, "");
  const ddd = local.slice(0, 2);
  const n = local.slice(2);
  return n.length === 9
    ? `(${ddd}) ${n.slice(0, 5)}-${n.slice(5)}`
    : `(${ddd}) ${n.slice(0, 4)}-${n.slice(4)}`;
}

/**
 * Números em um lugar só, no formato E.164 (país + DDD + número, só dígitos).
 * Formato de exibição e links tel:/wa.me são derivados daqui — trocar o
 * número é trocar uma string.
 */
const WHATSAPP = "5524981512696";
const TELEFONES = ["552422425548", "552422425341"];

export const negocio = {
  nome: "Refrigeração Garrido",
  razaoSocial: "Refrigeração Garrido Ltda",
  cnpj: "31.173.768/0001-90",
  inscricaoEstadual: "80.637.179",
  inscricaoMunicipal: "4733",
  email: "refrigeracaogarrido@yahoo.com.br",
  fundacao: 1971,
  chamada: "Peças, equipamentos e assistência técnica em Petrópolis",
  endereco: {
    /** A loja ocupa três números; o cartão diz "192 a 212". */
    rua: "Rua Marechal Floriano Peixoto, 192 a 212",
    bairro: "Centro",
    cidade: "Petrópolis",
    uf: "RJ",
    cep: "25610-081",
    lat: -22.5064684,
    lng: -43.1683773,
  },
  telefones: TELEFONES.map((e164) => ({ rotulo: "Loja", numero: formataBR(e164), href: `tel:+${e164}` })),
  whatsapp: { numero: formataBR(WHATSAPP), e164: WHATSAPP },
  instagram: { handle: "@refrigeracaogarrido", url: "https://www.instagram.com/refrigeracaogarrido/" },
  mapa: "https://www.google.com/maps?cid=618575051065636225",
  /** Lido no perfil do Google em agosto de 2026. Reconferir de tempos em tempos. */
  google: { nota: 4.2, avaliacoes: 112 },
} as const;

/**
 * Calculado a cada chamada, não ao carregar o módulo: com a página
 * regenerada todo dia (revalidate), o número vira sozinho na virada do ano.
 */
export const anosDeCasa = () => new Date().getFullYear() - negocio.fundacao;

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
