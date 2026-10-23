import Link from "next/link";
import { storyblokEditable, StoryblokServerRichText } from "@storyblok/react/rsc";
import { colorSrm } from "@/lib/cervezas";
import { foto } from "@/lib/utilidades";

const textos = {
  es: { todas: "Todas las cervezas", alc: "Alcohol", ibu: "Amargor (IBU)", srm: "Color (SRM)", tipo: "Tipo",
        linea: "De línea", temporada: "De temporada", marida: "Marida con" },
  en: { todas: "All beers", alc: "ABV", ibu: "Bitterness (IBU)", srm: "Color (SRM)", tipo: "Type",
        linea: "Year-round", temporada: "Seasonal", marida: "Pairs with" },
};

// Página de cada cerveza (tipo de contenido "cerveza" en Storyblok)
export default function Cerveza({ blok }) {
  const lang = blok._idioma || "es";
  const t = textos[lang] || textos.es;
  const color = colorSrm(blok.srm);

  const datos = [
    blok.abv && [t.alc, `${blok.abv}%`],
    blok.ibu && [t.ibu, blok.ibu],
    blok.srm && [
      t.srm,
      <span key="srm" className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="size-4 rounded-full ring-1 ring-carbon/20" style={{ background: color }} />
        {blok.srm}
      </span>,
    ],
    blok.line && [t.tipo, t[blok.line] || blok.line],
  ].filter(Boolean);

  return (
    <article {...storyblokEditable(blok)} className="pb-24 pt-8 md:pb-32 md:pt-14">
      <div className="contenedor">
        <Link href={`/${lang}/cerveceria`} className="text-carbon/70 transition-colors hover:text-carbon">
          ← {t.todas}
        </Link>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-12">
          <div className="relative flex h-[55vh] max-h-[620px] min-h-[340px] items-end justify-center md:col-span-5">
            <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-6 w-[45%] -translate-x-1/2 rounded-[50%] bg-carbon/30 blur-lg" />
            {blok.image?.filename && (
              <img
                src={foto(blok.image, 1200)}
                alt={blok.image.alt || blok.name}
                fetchPriority="high"
                className="aparece relative h-full w-auto max-w-full object-contain"
              />
            )}
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {blok.style && <p className="text-lg font-medium italic text-ladrillo">{blok.style}</p>}
            <h1 className="mt-2 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95]">{blok.name}</h1>
            {blok.description && <p className="mt-6 max-w-[40ch] text-lg">{blok.description}</p>}

            {datos.length > 0 && (
              <dl className="mt-10">
                {datos.map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="grid grid-cols-[10rem_1fr] gap-6 border-t border-carbon/15 py-4 last:border-b">
                    <dt className="text-carbon/60">{etiqueta}</dt>
                    <dd>{valor}</dd>
                  </div>
                ))}
              </dl>
            )}

            {blok.notes?.content?.length > 0 && (
              <div className="mt-10 max-w-[60ch] text-carbon/85 [&_p+p]:mt-5">
                <StoryblokServerRichText document={blok.notes} />
              </div>
            )}

            {blok.pairing && (
              <div className="mt-8">
                <h2 className="text-[0.9375rem] text-carbon/60">{t.marida}</h2>
                <p className="mt-1">{blok.pairing}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
