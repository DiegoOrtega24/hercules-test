import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";
import { encuadre, enlace, foto, srcSet } from "@/lib/utilidades";
import Revelar from "./Revelar";

// Un venue del mosaico. Al inicio: foto con el nombre (o logo) al centro.
// En laptop, al pasar el mouse, se oscurece y aparecen el texto y el botón;
// en celular, al pasar con el dedo por la mitad de la pantalla.
export default function MosaicTile({ blok }) {
  const href = enlace(blok.link);
  const logo = blok.logo?.filename;
  const abrir = "group-hover/mosaico:grid-rows-[1fr] group-focus-within/mosaico:grid-rows-[1fr] tactil:group-data-[revelado=true]/mosaico:grid-rows-[1fr]";
  const mostrar = "group-hover/mosaico:opacity-100 group-focus-within/mosaico:opacity-100 tactil:group-data-[revelado=true]/mosaico:opacity-100";
  const oscurecer = "group-hover/mosaico:bg-carbon/65 group-focus-within/mosaico:bg-carbon/65 tactil:group-data-[revelado=true]/mosaico:bg-carbon/60";

  return (
    <Revelar as="article" {...storyblokEditable(blok)} className="group/mosaico relative aspect-[4/3] overflow-hidden bg-carbon text-crema md:aspect-[3/4]">
      {blok.image?.filename && (
        <img
          src={foto(blok.image, 900)}
          srcSet={srcSet(blok.image, [480, 900, 1300])}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          alt=""
          style={{ objectPosition: encuadre(blok.image) }}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/mosaico:scale-[1.04]"
        />
      )}
      <div aria-hidden="true" className={`absolute inset-0 bg-carbon/30 transition-colors duration-500 ${oscurecer}`} />
      <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
        {logo ? (
          <>
            <img src={logo} alt="" className="h-auto max-h-20 w-auto max-w-[70%]" />
            <h3 className="sr-only">{blok.name}</h3>
          </>
        ) : (
          <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.02]">{blok.name}</h3>
        )}
        <div className={`grid w-full grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${abrir}`}>
          <div className={`overflow-hidden opacity-0 transition-opacity duration-500 ${mostrar}`}>
            {blok.text && <p className="mx-auto max-w-[28ch] pt-3 text-[0.9375rem]">{blok.text}</p>}
            {href && blok.link_label && (
              <Link href={href} className="boton mt-4 text-sm">
                {blok.link_label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Revelar>
  );
}
