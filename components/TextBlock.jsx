import { storyblokEditable, StoryblokServerRichText } from "@storyblok/react/rsc";
import Acciones from "./Acciones";

// "normal": título a la izquierda y texto a la derecha
// "destacado": una frase grande, sin título
// "centrado": formato de la Guía Web Tours: título en mayúsculas, cuerpo
//             centrado con párrafos separados y botones abajo
export default function TextBlock({ blok }) {
  if (blok.style === "centrado") {
    return (
      <section {...storyblokEditable(blok)} className="py-12 md:py-20">
        <div className="aparece contenedor flex flex-col items-center text-center">
          {blok.title && (
            <h2 className="max-w-[24ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">{blok.title}</h2>
          )}
          {blok.body && (
            <div className="mt-6 max-w-[58ch] text-lg leading-relaxed [&_h2]:mt-12 [&_h2]:text-[1.75rem] [&_h3]:mt-12 [&_h3]:text-[1.75rem] [&_h2+p]:mt-2 [&_h3+p]:mt-2 [&_p+p]:mt-6">
              <StoryblokServerRichText document={blok.body} />
            </div>
          )}
          <Acciones blok={blok} className="mt-10 justify-center" />
        </div>
      </section>
    );
  }

  if (blok.style === "destacado") {
    return (
      <section {...storyblokEditable(blok)} className="py-12 md:py-20">
        <div className="contenedor">
          <div className="aparece max-w-[28ch] font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em] [&_p+p]:mt-6">
            {blok.body && <StoryblokServerRichText document={blok.body} />}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section {...storyblokEditable(blok)} className="py-10 md:py-16">
      <div className="aparece contenedor grid gap-6 md:grid-cols-12 md:gap-12">
        {blok.title && (
          <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] md:col-span-4">
            {blok.title}
          </h2>
        )}
        {blok.body && (
          <div className="max-w-[62ch] text-carbon/85 md:col-span-6 md:col-start-7 [&_p+p]:mt-5">
            <StoryblokServerRichText document={blok.body} />
          </div>
        )}
      </div>
    </section>
  );
}
