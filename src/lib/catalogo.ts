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

/** As seis gavetas do balcão — o que a loja vende. */
export const gavetas: Gaveta[] = [
  {
    id: "pecas",
    nome: "Peças de reposição",
    resumo: "A peça que a assistência autorizada demora semanas para pedir.",
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
      "Balcões e expositores",
      "Freezers e conservadores",
      "Compressores",
      "Filtros secadores",
      "Gás refrigerante",
      "Pressostatos",
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
      "Fogões industriais",
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
  Icone: Icone;
};

/** Assistência técnica. Confirmar a lista com a cliente antes de publicar. */
export const servicos: Servico[] = [
  {
    id: "geladeira",
    nome: "Geladeira e freezer",
    descricao: "Não gela, faz gelo demais, vaza água ou não liga.",
    Icone: Geladeira,
  },
  {
    id: "lavar",
    nome: "Máquina de lavar",
    descricao: "Não centrifuga, não enche, faz barulho ou trava no ciclo.",
    Icone: MaquinaLavar,
  },
  {
    id: "balcao",
    nome: "Balcão e expositor",
    descricao: "Manutenção do que segura a mercadoria do seu comércio.",
    Icone: BalcaoRefrigerado,
  },
  {
    id: "camara",
    nome: "Câmara fria",
    descricao: "Instalação, carga de gás e correção de temperatura.",
    Icone: CamaraFria,
  },
  {
    id: "fogao",
    nome: "Fogão e forno industrial",
    descricao: "Regulagem, troca de queimador e revisão de gás.",
    Icone: FogaoIndustrial,
  },
  {
    id: "ar",
    nome: "Ar-condicionado",
    descricao: "Limpeza, recarga e conserto de split e janela.",
    Icone: ArCondicionado,
  },
];

/**
 * Só marcas que aparecem na fachada e nos posts da loja.
 * Ampliar depois de confirmar a lista com a cliente.
 */
export const marcas = ["Gelopar", "Alado", "Nacional", "CP Eletrônica", "Metax"];
