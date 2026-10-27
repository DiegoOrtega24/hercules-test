import { storyblokEditable } from "@storyblok/react/rsc";
import { encuadre, foto, srcSet } from "@/lib/utilidades";
import Acciones from "./Acciones";

export default function SectionTile({ blok }) {
  const logo = blok.logo?.filename;
  return (
    <article {...storyblokEditable(blok)} className="aparece flex flex-col">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.02]">{blok.title}</h2>
          {blok.text && <p className="mt-2 max-w-[42ch] text-carbon/75 md:min-h-[3.4rem]">{blok.text}</p>}
        </div>
        {logo && (
          <img src={logo} alt={blok.logo.alt || ""} className="h-auto max-h-14 w-auto max-w-[6.5rem] shrink-0 md:max-h-20 md:max-w-[8rem]" />
        )}
      </div>
      {blok.image?.filename && (
        <div className="paralaje mt-5 aspect-[4/3]">
          <img
            src={foto(blok.image, 1400)}
            srcSet={srcSet(blok.image, [640, 1000, 1400])}
            sizes="(min-width: 768px) 48vw, 100vw"
            alt={blok.image.alt || ""}
            style={{ objectPosition: encuadre(blok.image) }}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <Acciones blok={blok} className="mt-5" />
    </article>
  );
}
