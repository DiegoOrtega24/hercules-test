import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";

// Mosaico de venues: fotos verticales con el nombre o logo encima.
export default function VenueMosaic({ blok }) {
  return (
    <section {...storyblokEditable(blok)} className="py-8 md:py-14">
      <div className="contenedor">
        {(blok.title || blok.intro) && (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
            {blok.title && <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1]">{blok.title}</h2>}
            {blok.intro && <p className="max-w-[46ch] text-carbon/75">{blok.intro}</p>}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {blok.items?.map((item) => (
            <StoryblokServerComponent blok={item} key={item._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
