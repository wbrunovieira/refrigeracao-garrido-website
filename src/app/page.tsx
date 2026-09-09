import { AtivarRevelacao } from "@/components/revelar";
import { Cabecalho } from "@/components/cabecalho";
import { Heroi } from "@/components/heroi";
import { Prateleira } from "@/components/prateleira";
import { Balcao } from "@/components/balcao";
import { Assistencia } from "@/components/assistencia";
import { Historia } from "@/components/historia";
import { Depoimentos } from "@/components/depoimentos";
import { Galeria } from "@/components/galeria";
import { Visite } from "@/components/visite";
import { Rodape } from "@/components/rodape";
import { WhatsappFlutuante } from "@/components/whatsapp-flutuante";

// Regenerada uma vez por dia: é o que faz "há N anos" virar sozinho no ano-novo.
export const revalidate = 86400;

export default function Pagina() {
  return (
    <>
      <AtivarRevelacao />
      <Cabecalho />
      <main className="flex-1">
        <Heroi />
        <Prateleira />
        <Balcao />
        <Assistencia />
        <Historia />
        <Depoimentos />
        <Galeria />
        <Visite />
      </main>
      <Rodape />
      <WhatsappFlutuante />
    </>
  );
}
