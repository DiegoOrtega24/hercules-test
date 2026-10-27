import { storyblokEditable } from "@storyblok/react/rsc";
import { encuadre, foto, srcSet } from "@/lib/utilidades";
import Acciones from "./Acciones";
import Tocable from "./Tocable";

// Un venue del mosaico. Al inicio: foto con el logo (o el nombre) al centro.
// Con mouse: al pasar por encima. En celular: al apoyar el dedo (se queda
// abierto hasta que tocas otro). Se oscurece la foto, el logo se encoge y
// aparecen el texto y los botones.
export default function MosaicTile({ blok }) {
  const logo = blok.logo?.filename;

  return (
    <Tocable
      as="article"
      {...storyblokEditable(blok)}
      className="group/mosaico relative aspect-[4/5] overflow-hidden bg-carbon text-crema [-webkit-tap-highlight-color:transparent] sm:aspect-[3/4]"
    >
      {blok.image?.filename && (
        <img
          src={foto(blok.image, 900)}
          srcSet={srcSet(blok.image, [480, 900, 1300])}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          alt=""
          style={{ objectPosition: encuadre(blok.image) }}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/mosaico:scale-[1.04] group-data-[activo=true]/mosaico:scale-[1.04]"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-carbon/30 transition-colors duration-500 group-hover/mosaico:bg-carbon/65 group-focus-within/mosaico:bg-carbon/65 group-data-[activo=true]/mosaico:bg-carbon/65"
      />
      <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
        {logo ? (
          <>
            <img
              src={logo}
              alt=""
              className="h-auto max-h-32 w-auto max-w-[72%] transition-[max-width,max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mosaico:max-h-16 group-hover/mosaico:max-w-[45%] group-focus-within/mosaico:max-h-16 group-focus-within/mosaico:max-w-[45%] group-data-[activo=true]/mosaico:max-h-16 group-data-[activo=true]/mosaico:max-w-[45%]"
            />
            <h3 className="sr-only">{blok.name}</h3>
          </>
        ) : (
          <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.02]">{blok.name}</h3>
        )}
        <div className="grid w-full grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mosaico:grid-rows-[1fr] group-focus-within/mosaico:grid-rows-[1fr] group-data-[activo=true]/mosaico:grid-rows-[1fr]">
          <div className="translate-y-2 overflow-hidden opacity-0 transition-[opacity,translate] duration-500 ease-out group-hover/mosaico:translate-y-0 group-hover/mosaico:opacity-100 group-hover/mosaico:delay-100 group-focus-within/mosaico:translate-y-0 group-focus-within/mosaico:opacity-100 group-data-[activo=true]/mosaico:translate-y-0 group-data-[activo=true]/mosaico:opacity-100 group-data-[activo=true]/mosaico:delay-100">
            {blok.text && <p className="mx-auto max-w-[28ch] pt-3 text-[0.9375rem]">{blok.text}</p>}
            <Acciones blok={blok} className="justify-center pb-1 pt-4 text-sm" />
          </div>
        </div>
      </div>
    </Tocable>
  );
}
