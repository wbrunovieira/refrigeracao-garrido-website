/**
 * O que a cliente revisa. O site é uma página só, então a unidade de revisão é a SEÇÃO — na
 * ordem em que ela aparece rolando, do cabeçalho ao rodapé — mais a página provisória que hoje
 * responde no domínio.
 *
 * O modelo de eventos continua página + seção (é o mesmo painel usado em outros projetos da WB):
 * aqui existe uma página só, `site`, e cada seção é um item dela.
 *
 * Os `id` são a chave dos eventos registrados. **Nunca renomeie um id que já esteja em uso**: o
 * histórico de aprovação está amarrado a ele. Mudar o `titulo` e a `nota` é livre.
 */

export type SecaoRevisao = { id: string; titulo: string };

export type PaginaRevisao = {
  id: string;
  titulo: string;
  /** Caminho no site, aberto em nova aba a partir da revisão. */
  href: string;
  grupo: string;
  nota?: string;
  secoes: SecaoRevisao[];
};

export const PAGINA_SITE = "site";

export const paginasRevisao: PaginaRevisao[] = [
  {
    id: "site",
    titulo: "O site",
    href: "/",
    grupo: "Seções do site",
    secoes: [
      { id: "cabecalho", titulo: "Cabeçalho: marca animada, menu, horário e WhatsApp" },
      { id: "abertura", titulo: "Quebrou? A peça está no balcão." },
      { id: "faixa-de-marcas", titulo: "Faixa de marcas e tipos de peça" },
      { id: "o-balcao", titulo: "Abra a gaveta, pergunte se tem." },
      { id: "assistencia", titulo: "Quando a peça não resolve sozinha." },
      { id: "historia", titulo: "Meio século atrás do mesmo balcão." },
      { id: "depoimentos", titulo: "O que dizem no balcão e fora dele." },
      { id: "galeria", titulo: "Uma volta pelo corredor." },
      { id: "visite", titulo: "Fica no Centro, embaixo do toldo verde." },
      { id: "rodape", titulo: "Rodapé: contatos, endereço e dados da empresa" },
      { id: "botao-whatsapp", titulo: "Botão flutuante do WhatsApp" },
      { id: "dados-da-loja", titulo: "Telefones, WhatsApp, horário e e-mail" },
      { id: "pagina-provisoria", titulo: "Página provisória em refrigeracaogarrido.com.br" },
    ],
  },
];

/**
 * Por seção: onde ela abre no site e uma frase sobre o que olhar. Fica fora da lista acima para
 * o script de importação continuar lendo os ids com o mesmo formato dos outros projetos.
 */
export const DETALHE: Record<string, { href: string; etiqueta?: string; nota: string }> = {
  cabecalho: {
    href: "/#topo",
    etiqueta: "Topo",
    nota: "A marca do cartão de visita animada (o pinguim chega e endireita o G), o menu, o horário de hoje e o botão do WhatsApp. Ao rolar, a barra encolhe.",
  },
  abertura: {
    href: "/#topo",
    etiqueta: "Abertura",
    nota: "A primeira tela: a frase, a foto da fachada, os anos de balcão (contam sozinhos desde 1971) e os telefones.",
  },
  "faixa-de-marcas": {
    href: "/#prateleira",
    etiqueta: "Faixa",
    nota: "As etiquetas amarelas passando: Gelopar, Alado, Nacional, CP Eletrônica, Metax e os tipos de peça. Confira se as marcas estão certas.",
  },
  "o-balcao": {
    href: "/#balcao",
    etiqueta: "O que a gente vende",
    nota: "As sete gavetas (peças, refrigeração, cozinha, comércio, elétrica, água, ferramentas). A pessoa marca o que procura e a pergunta já chega montada no WhatsApp da loja.",
  },
  assistencia: {
    href: "/#assistencia",
    etiqueta: "Assistência técnica",
    nota: "Os serviços em casa e no comércio. Alguns foram deduzidos do Instagram (balcão, câmara fria, fogão, ar-condicionado): confirme o que a loja atende de fato.",
  },
  historia: {
    href: "/#historia",
    etiqueta: "Desde 1971",
    nota: "A história da loja, as fotos antigas e a frase do Instagram. Se houver datas, nomes ou fatos a corrigir, é aqui.",
  },
  depoimentos: {
    href: "/#depoimentos",
    etiqueta: "Quem já passou por aqui",
    nota: "Uma avaliação do Apontador e três do Google, todas reais e com nome. O botão 'Avaliar no Google' abre direto o formulário de avaliação.",
  },
  galeria: {
    href: "/#galeria",
    etiqueta: "Por dentro da loja",
    nota: "Fotos tiradas na própria loja (vieram do Instagram). Se alguma não deve aparecer, ou se há fotos melhores, diga qual.",
  },
  visite: {
    href: "/#visite",
    etiqueta: "Visite a loja",
    nota: "Endereço, mapa, botões de rota (Google Maps e Waze chegando na loja), telefones e o convite para avaliar no Google.",
  },
  rodape: {
    href: "/#rodape",
    etiqueta: "Rodapé",
    nota: "Razão social, CNPJ, inscrições estadual e municipal, e-mail, endereço e a assinatura da WB. Confira os números com o cartão.",
  },
  "botao-whatsapp": {
    href: "/#topo",
    etiqueta: "Em todas as telas",
    nota: "O botão verde no canto que acompanha a rolagem no celular. Abre o WhatsApp da loja com a primeira mensagem já escrita.",
  },
  "dados-da-loja": {
    href: "/#visite",
    etiqueta: "Para confirmar",
    nota: "Telefones (24) 2242-5548 e (24) 2242-5341, WhatsApp (24) 98151-2696, e-mail refrigeracaogarrido@yahoo.com.br e o horário — o site diz que fecha às 18h30, o Google diz 18h. Qual está certo? E sábado?",
  },
  "pagina-provisoria": {
    href: "https://refrigeracaogarrido.com.br/",
    etiqueta: "Já no ar",
    nota: "O que quem digita o endereço vê hoje, enquanto o site completo não é aprovado: a marca, os telefones e o WhatsApp.",
  },
};
