import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";
import { enlace, foto, srcSet, encuadre } from "@/lib/utilidades";

export default function Card({ blok }) {
  const href = enlace(blok.link);
  return (
    <article {...storyblokEditable(blok)} className="aparece group">
      {blok.image?.filename && (
        <div className="overflow-hidden">
        <img
          src={foto(blok.image, 900)}
          srcSet={srcSet(blok.image, [480, 900, 1300])}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          alt={blok.image.alt || ""}
            style={{ objectPosition: encuadre(blok.image) }}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        </div>
      )}
      <h3 className="mt-5 font-display text-[1.625rem] leading-tight">{blok.title}</h3>
      {blok.detail && <p className="mt-1 text-[0.9375rem] italic text-ladrillo">{blok.detail}</p>}
      {blok.text && <p className="mt-3 max-w-[40ch] text-carbon/80">{blok.text}</p>}
      {href && blok.link_label && (
        <Link href={href} className="mt-4 inline-block border-b border-current pb-0.5 font-medium">
          {blok.link_label}
        </Link>
      )}
    </article>
  );
}
