import { Whatsapp } from "@/components/icones";
import { whatsapp } from "@/lib/negocio";

/** Atalho permanente no celular, onde a barra do topo some ao rolar. */
export function WhatsappFlutuante() {
  return (
    <a
      href={whatsapp("Olá! Vim pelo site da Refrigeração Garrido.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a loja no WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-ouro text-verde-950 shadow-[0_12px_36px_-8px] shadow-ouro/70 acao sm:hidden"
    >
      <Whatsapp className="size-7" />
    </a>
  );
}
