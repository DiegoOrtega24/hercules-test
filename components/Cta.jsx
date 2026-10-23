import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";
import { enlace } from "@/lib/utilidades";

const claro = "bg-carbon text-crema hover:bg-olivo";
const oscuro = "bg-crema text-carbon hover:bg-arena";

// Planos o con textura de la fábrica (ladrillo, óxido, muro)
export const fondos = {
  arena: { seccion: "bg-arena text-carbon", boton: claro },
  carbon: { seccion: "bg-carbon text-crema", boton: oscuro },
  crema: { seccion: "fondo-crema text-carbon", boton: claro },
  ladrillo: { seccion: "textura-ladrillo text-crema", boton: oscuro },
  oxido: { seccion: "textura-oxido text-crema", boton: oscuro },
  muro: { seccion: "textura-muro text-crema", boton: oscuro },
  "arena-textura": { seccion: "textura-arena text-carbon", boton: claro },
};

// Invitación a actuar: reservar, cotizar, comprar
export default function Cta({ blok }) {
  const estilo = fondos[blok.background] || fondos.oxido;
  const href = enlace(blok.link);
  return (
    <section {...storyblokEditable(blok)} className={`mt-8 py-16 md:mt-12 md:py-24 ${estilo.seccion}`}>
      <div className="aparece contenedor grid gap-8 md:grid-cols-12 md:items-end md:gap-12">
        <div className="md:col-span-7">
          <h2 className="font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1]">{blok.title}</h2>
          {blok.text && <p className="mt-5 max-w-[46ch] opacity-85">{blok.text}</p>}
        </div>
        {href && blok.button_label && (
          <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
            <Link href={href} className="boton">
              {blok.button_label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
