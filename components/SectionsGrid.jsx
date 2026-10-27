import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";

// Secciones principales (Cervecería, Jardín, Hotel, Almacén) en cuadrícula
// de 2: título primero, después la foto 4:3 y los botones.
export default function SectionsGrid({ blok }) {
  return (
    <section {...storyblokEditable(blok)} className="py-8 md:py-14">
      <div className="contenedor">
        {blok.title && (
          <h2 className="mb-8 font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] md:mb-10">{blok.title}</h2>
        )}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16">
          {blok.items?.map((item) => (
            <StoryblokServerComponent blok={item} key={item._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
