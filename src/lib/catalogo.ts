import type { ComponentType, SVGProps } from "react";
import {
  ArCondicionado,
  BalcaoRefrigerado,
  CamaraFria,
  Ferramenta,
  Filtro,
  FogaoIndustrial,
  Geladeira,
  LavaESeca,
  MaquinaLavar,
  PlacaEletronica,
} from "@/components/icones";

type Icone = ComponentType<SVGProps<SVGSVGElement>>;

export type Gaveta = {
  id: string;
  nome: string;
  resumo: string;
  itens: string[];
  foto: string;
  alt: string;
  Icone: Icone;
};

/**
 * As gavetas do balcão — o que a loja vende. A base é o cartão de visita
 * ("temos para venda: balcões frigoríficos, geladeiras, máquinas de café,
 * estufas, balanças, cortadores de frios, picadores de carne, fogões e fornos
 * comerciais, liquidificadores, extratores de suco") mais o que aparece nas
 * fotos da loja.
 */
export const gavetas: Gaveta[] = [
  {
    id: "pecas",
    nome: "Peças de reposição",
    resumo: "Para geladeira, máquina de lavar e o que mais tiver quebrado.",
    itens: [
      "Placas eletrônicas",
      "Rolamentos e retentores",
      "Cruzetas e tirantes",
      "Termostatos",
      "Resistências",
      "Correias e polias",
    ],
    foto: "/fotos/pecas-maquina-lavar.webp",
    alt: "Cruzeta de tanque de máquina de lavar sobre o balcão da loja",
    Icone: MaquinaLavar,
  },
  {
    id: "lava-e-seca",
    nome: "Lava e seca",
    resumo: "Lava e seca é outra máquina por dentro — e a peça é outra também.",
    itens: [
      "Resistências de secagem",
      "Placas e módulos",
      "Rolamentos e retentores",
      "Amortecedores e molas",
      "Bombas de dreno",
      "Correias",
      "Borrachas de porta",
      "Sensores e termostatos",
    ],
    // Foto de apoio (CC0, via Openverse): a loja ainda não tem foto de lava e seca.
    foto: "/fotos/lava-e-seca.webp",
    alt: "Lavadora e secadora lado a lado, com as portas de vidro à mostra",
    Icone: LavaESeca,
  },
  {
    id: "refrigeracao",
    nome: "Refrigeração comercial",
    resumo: "Para quem vive de manter a mercadoria gelada.",
    itens: [
      "Balcões frigoríficos",
      "Geladeiras e freezers",
      "Expositores",
      "Compressores",
      "Filtros secadores",
      "Gás refrigerante",
    ],
    // A única foto que não é da loja: aqui o que importa é o equipamento em uso,
    // e a fachada já aparece no herói e na galeria. CC0 (rawpixel/Wikimedia
    // Commons), sem exigência de crédito.
    foto: "/fotos/balcao-refrigerado.webp",
    alt: "Balcão frigorífico com prateleiras de vidro cheias de mercadoria",
    Icone: BalcaoRefrigerado,
  },
  {
    id: "cozinha",
    nome: "Cozinha industrial",
    resumo: "Equipamento de linha pesada para bar, padaria e restaurante.",
    itens: [
      "Fogões e fornos comerciais",
      "Fritadeiras",
      "Fogareiros",
      "Panelas de alumínio",
      "Cestos e escumadeiras",
      "Chapas e bancadas",
    ],
    foto: "/fotos/fogao-industrial.webp",
    alt: "Fogão industrial vermelho de quatro bocas exposto na loja",
    Icone: FogaoIndustrial,
  },
  {
    id: "comercio",
    nome: "Equipamentos para comércio",
    resumo: "O que o balcão da padaria, do açougue e da lanchonete precisa.",
    itens: [
      "Máquinas de café",
      "Balanças",
      "Cortadores de frios",
      "Picadores de carne",
      "Liquidificadores",
      "Extratores de suco",
      "Estufas",
    ],
    foto: "/fotos/fritadeira-industrial.webp",
    alt: "Fritadeira industrial de inox exposta na loja",
    Icone: BalcaoRefrigerado,
  },
  {
    id: "eletrica",
    nome: "Elétrica e componentes",
    resumo: "O corredor onde o técnico resolve o chamado do dia.",
    itens: [
      "Capacitores",
      "Relés e protetores térmicos",
      "Placas de lavadora",
      "Motores e bombas de lavadora",
      "Pressostatos e timers",
      "Chicotes e terminais",
      "Chaves e contatoras",
      "Fusíveis",
      "Módulos de comando",
    ],
    foto: "/fotos/estoque-placas.webp",
    alt: "Prateleiras com caixas de placas eletrônicas identificadas por código",
    Icone: PlacaEletronica,
  },
  {
    id: "agua",
    nome: "Filtros e purificadores",
    resumo: "Do filtro de barro da avó ao refil do purificador novo.",
    itens: [
      "Refis Planeta Água",
      "Refil para vários purificadores",
      "Filtros de barro",
      "Velas cerâmicas",
      "Torneiras e boias",
      "Purificadores",
      "Mangueiras",
      "Conexões",
    ],
    foto: "/fotos/filtro-barro.webp",
    alt: "Filtro de barro com torneira sobre o balcão",
    Icone: Filtro,
  },
  {
    id: "ferramentas",
    nome: "Ferramentas e químicos",
    resumo: "O que falta na maleta na hora do serviço.",
    itens: [
      "Adesivos e vedantes",
      "Solda e maçarico",
      "Alicates e chaves",
      "Manifolds",
      "Fitas isolantes",
      "Limpa-contatos",
    ],
    foto: "/fotos/loja-prateleiras.webp",
    alt: "Prateleiras da loja com ferramentas, colas e produtos de manutenção",
    Icone: Ferramenta,
  },
];

export type Servico = {
  id: string;
  nome: string;
  descricao: string;
  /** Como o cliente diz o problema no WhatsApp — lê natural mesmo enviado sem editar. */
  chamado: string;
  /** Quem costuma abrir esse chamado — separa a casa do comércio. */
  publico: "residencia" | "comercio";
  Icone: Icone;
};

/**
 * Assistência técnica. O cartão declara consertos em geladeiras domésticas e
 * comerciais, máquinas de lavar, secadoras e lava e seca. Balcão, câmara fria,
 * fogão e ar-condicionado são inferidos — confirmar com a cliente.
 */
export const servicos: Servico[] = [
  {
    id: "geladeira",
    nome: "Geladeira e freezer",
    descricao: "Doméstica ou comercial: não gela, faz gelo demais, vaza água ou não liga.",
    chamado: "Minha geladeira (ou freezer) está com problema.",
    publico: "residencia",
    Icone: Geladeira,
  },
  {
    id: "lavar",
    nome: "Máquina de lavar e secadora",
    descricao: "Não centrifuga, não enche, não seca, faz barulho ou trava no ciclo.",
    chamado: "Minha máquina de lavar (ou secadora) está com problema.",
    publico: "residencia",
    Icone: MaquinaLavar,
  },
  {
    id: "lava-e-seca",
    nome: "Lava e seca",
    descricao: "Lava mas não seca, para no meio do ciclo, não aquece ou dá erro no painel.",
    chamado: "Minha lava e seca está com problema.",
    publico: "residencia",
    Icone: LavaESeca,
  },
  {
    id: "balcao",
    nome: "Balcão e expositor",
    descricao: "Manutenção do que segura a mercadoria do seu comércio.",
    chamado: "O balcão refrigerado do meu comércio está com problema.",
    publico: "comercio",
    Icone: BalcaoRefrigerado,
  },
  {
    id: "camara",
    nome: "Câmara fria",
    descricao: "Instalação, carga de gás e correção de temperatura.",
    chamado: "A câmara fria do meu comércio precisa de manutenção.",
    publico: "comercio",
    Icone: CamaraFria,
  },
  {
    id: "fogao",
    nome: "Fogão e forno industrial",
    descricao: "Regulagem, troca de queimador e revisão de gás.",
    chamado: "O fogão (ou forno) industrial do meu comércio está com problema.",
    publico: "comercio",
    Icone: FogaoIndustrial,
  },
  {
    id: "ar",
    nome: "Ar-condicionado",
    descricao: "Limpeza, recarga e conserto de split e janela.",
    chamado: "Meu ar-condicionado está com problema.",
    publico: "residencia",
    Icone: ArCondicionado,
  },
];

/**
 * Só marcas que aparecem na fachada e nos posts da loja, com o logo oficial de
 * cada uma (public/marcas, baixado do site do fabricante). "Metax" saiu da
 * lista em 09/2026: não existe fabricante com esse nome no ramo — era leitura
 * errada de foto; provavelmente Metvisa. Confirmar com a cliente antes de repor.
 */
export const marcas = [
  { nome: "Gelopar", logo: "/marcas/gelopar.png", largura: 367, altura: 79 },
  { nome: "Metalúrgica Alado", logo: "/marcas/alado.png", largura: 1000, altura: 296 },
  { nome: "CP Placas Eletrônicas", logo: "/marcas/cp-placas-eletronicas.svg", largura: 352, altura: 139 },
  { nome: "Alumínio Nacional", logo: "/marcas/aluminio-nacional.png", largura: 800, altura: 239 },
  // Marcas de eletrodomésticos que a loja atende (lista da cliente, 09/2026). Logos em SVG
  // do Wikimedia Commons (domínio público / marca registrada dos fabricantes).
  { nome: "Brastemp", logo: "/marcas/brastemp.svg", largura: 500, altura: 48 },
  { nome: "Consul", logo: "/marcas/consul.svg", largura: 500, altura: 128 },
  { nome: "Electrolux", logo: "/marcas/electrolux.svg", largura: 436, altura: 100 },
  { nome: "Samsung", logo: "/marcas/samsung.svg", largura: 1800, altura: 480 },
  { nome: "LG", logo: "/marcas/lg.svg", largura: 600, altura: 275 },
  { nome: "Midea", logo: "/marcas/midea.svg", largura: 122, altura: 47 },
];

/** Para frases curtas: "Oito gavetas" lê melhor que "8 gavetas". */
export function numeroPorExtenso(n: number) {
  const nomes = ["zero", "Uma", "Duas", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez"];
  return nomes[n] ?? String(n);
}
