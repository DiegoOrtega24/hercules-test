import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import Carril from "./Carril";

const textos = {
  es: { anterior: "Anterior", siguiente: "Siguiente", fotos: "Fotos" },
  en: { anterior: "Previous", siguiente: "Next", fotos: "Photos" },
};

// Carrusel: un carrete de fotos, o tarjetas con texto y botones (venues)
export default function Carousel({ blok }) {
  const t = textos[blok._idioma] || textos.es;
  const cabecera = (blok.title || blok.intro) && (
    <>
      {blok.title && <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1]">{blok.title}</h2>}
      {blok.intro && <p className="mt-3 max-w-[52ch] text-carbon/80">{blok.intro}</p>}
    </>
  );

  return (
    <section {...storyblokEditable(blok)} className="py-8 md:py-14">
      <Carril cabecera={cabecera} etiqueta={blok.title || t.fotos} anterior={t.anterior} siguiente={t.siguiente}>
        {blok.items?.map((item) => (
          <StoryblokServerComponent blok={item} key={item._uid} />
        ))}
      </Carril>
    </section>
  );
}
