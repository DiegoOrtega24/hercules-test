import { storyblokEditable } from "@storyblok/react/rsc";
import { foto, srcSet, encuadre } from "@/lib/utilidades";
import HerculesScroll from "./HerculesScroll";
import HeroFotos from "./HeroFotos";

const textos = {
  es: { foto: "Foto", pausar: "Pausar fotos", reanudar: "Reanudar fotos" },
  en: { foto: "Photo", pausar: "Pause photos", reanudar: "Play photos" },
};

// Dos tamaños:
//  - "completa" (Home): foto a pantalla completa (o carrusel de fotos) con el
//    logo y el título encima
//  - "media" (páginas interiores): título y después la foto 4:3
export default function Hero({ blok }) {
  if (blok.size !== "completa") return <HeroMedia blok={blok} />;

  const lista = blok.images?.filter((f) => f?.filename).length
    ? blok.images.filter((f) => f?.filename)
    : [blok.image].filter((f) => f?.filename);
  const fotos = lista.map((f) => ({
    src: foto(f, 2200),
    srcSet: srcSet(f),
    alt: f.alt || "",
    pos: encuadre(f),
  }));

  return (
    <section {...storyblokEditable(blok)} className="relative h-[100svh] min-h-[560px] touch-pan-y overflow-hidden bg-carbon text-crema">
      <HeroFotos fotos={fotos} t={textos[blok._idioma] || textos.es} />
      {/* Sombra suave solo arriba (menú) y abajo (título) para que se lean */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-carbon/45 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-carbon/70 via-carbon/25 to-transparent" />
      <div className="contenedor relative flex h-full flex-col justify-end pb-20 md:pb-24">
        <span role="img" aria-label="Compañía Cervecera Hércules" className="logo w-24 md:w-32" />
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1]">{blok.title}</h1>
        {blok.subtitle && <p className="mt-4 max-w-[46ch] text-lg">{blok.subtitle}</p>}
      </div>
    </section>
  );
}

function HeroMedia({ blok }) {
  const conHercules = blok.hercules;
  return (
    <section {...storyblokEditable(blok)} className="pb-8 pt-6 md:pb-12 md:pt-10">
      <div className="contenedor">
        <div className="relative">
          {conHercules && <HerculesScroll />}
          <div className={conHercules ? "pr-24 sm:pr-36 md:pr-44 lg:pr-56" : ""}>
            <h1 className="max-w-[16ch] font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98]">{blok.title}</h1>
            {blok.subtitle && <p className="mt-4 max-w-[44ch] text-lg text-carbon/75">{blok.subtitle}</p>}
          </div>
          {blok.image?.filename && (
            <div className="paralaje mt-8 aspect-[4/3] md:mt-10 md:aspect-[16/9]">
              <img
                src={foto(blok.image, 2200)}
                srcSet={srcSet(blok.image)}
                sizes="(min-width: 1440px) 1312px, 100vw"
                alt={blok.image.alt || ""}
                style={{ objectPosition: encuadre(blok.image) }}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
