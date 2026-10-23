import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";

// Grupo de tarjetas: cervezas, habitaciones, espacios, productos...
export default function Cards({ blok }) {
  return (
    <section {...storyblokEditable(blok)} className="py-10 md:py-16">
      <div className="contenedor">
        {(blok.title || blok.intro) && (
          <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-12 md:gap-12">
            {blok.title && (
              <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] md:col-span-5">
                {blok.title}
              </h2>
            )}
            {blok.intro && (
              <p className="max-w-[52ch] text-carbon/80 md:col-span-6 md:col-start-7">{blok.intro}</p>
            )}
          </div>
        )}
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {blok.items?.map((item) => (
            <StoryblokServerComponent blok={item} key={item._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
