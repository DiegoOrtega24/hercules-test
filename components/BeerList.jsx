import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";
import { cargarCervezas, colorSrm } from "@/lib/cervezas";
import { foto } from "@/lib/utilidades";

const textos = { es: { alc: "alc. vol." }, en: { alc: "ABV" } };

// Lista de cervezas: toma solas las cervezas de la carpeta "Cervezas" de
// Storyblok. Con mouse, al inicio solo se ven las latas; al pasar el mouse
// la lata se levanta y aparece su información. En celular todo está visible.
export default async function BeerList({ blok }) {
  const lang = blok._idioma || "es";
  const t = textos[lang] || textos.es;
  const cervezas = await cargarCervezas(lang, blok.filter, blok.limit);
  if (!cervezas.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="py-10 md:py-16">
      <div className="contenedor">
        {(blok.title || blok.intro) && (
          <div className="mb-12 grid gap-4 md:mb-16 md:grid-cols-12 md:gap-12">
            {blok.title && (
              <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] md:col-span-5">
                {blok.title}
              </h2>
            )}
            {blok.intro && <p className="max-w-[52ch] text-carbon/80 md:col-span-6 md:col-start-7">{blok.intro}</p>}
          </div>
        )}

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-16 sm:gap-x-10">
          {cervezas.map(({ slug, content: c }) => {
            const color = colorSrm(c.srm);
            return (
              <li
                key={slug}
                className="group/cerveza basis-[calc(50%-0.75rem)] sm:basis-[calc(33.333%-1.667rem)] lg:basis-[calc(25%-1.875rem)]"
              >
                <Link href={`/${lang}/cervezas/${slug}`} className="flex flex-col items-center text-center">
                  {/* La lata y su sombra en el piso */}
                  <div className="relative flex h-60 w-full items-end justify-center sm:h-72 lg:h-80">
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-1/2 h-4 w-[55%] -translate-x-1/2 rounded-[50%] bg-carbon/30 blur-md transition duration-500 ease-out raton:group-hover/cerveza:scale-x-75 raton:group-hover/cerveza:opacity-40 group-focus-within/cerveza:scale-x-75"
                    />
                    {c.image?.filename && (
                      <img
                        src={foto(c.image, 700)}
                        alt={c.image.alt || c.name}
                        loading="lazy"
                        className="relative h-full w-auto max-w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.45,0.64,1)] raton:group-hover/cerveza:-translate-y-5 raton:group-hover/cerveza:-rotate-3 raton:group-hover/cerveza:scale-[1.04] group-focus-within/cerveza:-translate-y-5"
                      />
                    )}
                  </div>

                  {/* Información: oculta con mouse hasta el hover; siempre visible en celular */}
                  <div className="mt-8 transition duration-500 ease-out raton:translate-y-3 raton:opacity-0 raton:group-hover/cerveza:translate-y-0 raton:group-hover/cerveza:opacity-100 group-focus-within/cerveza:translate-y-0 group-focus-within/cerveza:opacity-100">
                    <h3 className="font-display text-2xl leading-tight">{c.name}</h3>
                    {c.description && (
                      <p className="mx-auto mt-2 max-w-[28ch] text-[0.9375rem] text-carbon/75">{c.description}</p>
                    )}
                    {(c.style || c.abv) && (
                      <p className="mt-3 flex items-center justify-center gap-2 text-[0.9375rem] font-medium italic text-ladrillo">
                        {color && (
                          <span aria-hidden="true" className="size-3 rounded-full ring-1 ring-carbon/20" style={{ background: color }} />
                        )}
                        {c.style}
                        {c.style && c.abv ? ", " : ""}
                        {c.abv && `${c.abv}% ${t.alc}`}
                      </p>
                    )}
                    {blok.link_label && (
                      <span className="mt-4 inline-block border-b border-current pb-0.5 font-medium">
                        {blok.link_label} →
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
