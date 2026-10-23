import { storyblokEditable } from "@storyblok/react/rsc";
import { encuadre, foto, srcSet } from "@/lib/utilidades";
import Acciones from "./Acciones";

// Una foto del carrusel (4:3), con título, 2 o 3 líneas y botones opcionales
export default function Slide({ blok }) {
  return (
    <article {...storyblokEditable(blok)} className="w-[82%] shrink-0 snap-start sm:w-[58%] lg:w-[40%]">
      {blok.image?.filename && (
        <img
          src={foto(blok.image, 1400)}
          srcSet={srcSet(blok.image, [640, 1000, 1400])}
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 58vw, 82vw"
          alt={blok.image.alt || ""}
          style={{ objectPosition: encuadre(blok.image) }}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      )}
      {blok.title && <h3 className="mt-5 font-display text-[1.75rem] leading-tight">{blok.title}</h3>}
      {blok.text && <p className="mt-2 max-w-[44ch] text-carbon/80">{blok.text}</p>}
      <Acciones blok={blok} className="mt-6" />
    </article>
  );
}
