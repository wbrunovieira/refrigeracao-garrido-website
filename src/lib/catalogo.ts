import type { ComponentType, SVGProps } from "react";
import {
  ArCondicionado,
  BalcaoRefrigerado,
  CamaraFria,
  Ferramenta,
  Filtro,
  FogaoIndustrial,
  Geladeira,
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
    foto: "/fotos/fachada-toldo.webp",
    alt: "Fachada da Refrigeração Garrido na Rua Marechal Floriano Peixoto",
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
      "Chaves e contatoras",
      "Cabos e terminais",
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
      "Filtros de barro",
      "Velas e refis",
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
 * comerciais, máquinas de lavar e secadoras. Balcão, câmara fria, fogão e
 * ar-condicionado são inferidos — confirmar com a cliente.
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
 * Só marcas que aparecem na fachada e nos posts da loja.
 * Ampliar depois de confirmar a lista com a cliente.
 */
export const marcas = ["Gelopar", "Alado", "Nacional", "CP Eletrônica", "Metax"];
