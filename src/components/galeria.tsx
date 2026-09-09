import Image from "next/image";
import { Instagram, Seta } from "@/components/icones";
import { negocio } from "@/lib/negocio";

const fotos = [
  { src: "/fotos/fogao-industrial.webp", alt: "Fogão industrial vermelho de quatro bocas", largura: "col-span-2 row-span-2" },
  { src: "/fotos/panelas-industriais.webp", alt: "Torre de panelas industriais de alumínio" },
  { src: "/fotos/estoque-placas.webp", alt: "Prateleira com caixas de placas eletrônicas etiquetadas" },
  { src: "/fotos/fritadeira-industrial.webp", alt: "Fritadeira industrial de inox" },
  { src: "/fotos/pecas-alado.webp", alt: "Kit de rolamento e retentor para máquina de lavar" },
  { src: "/fotos/filtro-barro.webp", alt: "Filtro de barro com torneira" },
  { src: "/fotos/fogareiros.webp", alt: "Fogareiros azul e vermelho ainda embalados" },
  { src: "/fotos/cesto-fritadeira.webp", alt: "Cestos de fritadeira em inox" },
  { src: "/fotos/utensilios-cozinha.webp", alt: "Escumadeira e cesto sobre fogareiro" },
  { src: "/fotos/pecas-maquina-lavar.webp", alt: "Cruzeta de tanque de máquina de lavar" },
  { src: "/fotos/loja-prateleiras.webp", alt: "Corredor da loja com ferramentas e produtos de manutenção" },
  { src: "/fotos/equipe-balcao.webp", alt: "Conferência de peças no balcão de atendimento" },
  { src: "/fotos/fachada-toldo.webp", alt: "Toldo verde com o letreiro da Refrigeração Garrido" },
];

export function Galeria() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6" data-revelar>
          <div className="max-w-xl">
            <p className="etiqueta text-ouro/80">Por dentro da loja</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-creme">
              Uma volta pelo corredor.
            </h2>
            <p className="mt-5 leading-relaxed text-creme/65">
              Tudo aqui foi fotografado na própria loja e está na prateleira.
            </p>
          </div>
          <div className="max-w-xs" data-revelar data-atraso={160}>
            <p className="text-sm leading-relaxed text-creme/60">
              O que chega de novo na loja aparece primeiro lá. Siga para ver antes de vir.
            </p>
            <a
              href={negocio.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contorno contorno-ouro group mt-4 inline-flex items-center gap-2.5 rounded-full border border-creme/25 px-6 py-3 text-sm text-creme"
            >
              <Instagram className="size-4" />
              Seguir {negocio.instagram.handle}
              <Seta className="seta-vai size-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4">
          {fotos.map((f, i) => (
            <figure
              key={f.src}
              data-revelar
              data-atraso={i * 55}
              className={`cartao group relative overflow-hidden rounded-xl border border-verde-600/25 hover:border-verde-500/50 ${f.largura ?? ""}`}
            >
              <Image
                src={f.src}
                alt={f.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-suave)] group-hover:scale-[1.06]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-verde-950 to-transparent p-4 text-xs text-creme/90 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-suave)] group-hover:translate-y-0">
                {f.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
