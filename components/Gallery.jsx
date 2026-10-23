import { storyblokEditable } from "@storyblok/react/rsc";
import { foto, srcSet, encuadre } from "@/lib/utilidades";

const columnas = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

export default function Gallery({ blok }) {
  const fotos = blok.images?.filter((f) => f?.filename) || [];
  if (!fotos.length) return null;
  return (
    <section {...storyblokEditable(blok)} className="py-8 md:py-14">
      <div className={`contenedor grid grid-cols-2 items-start gap-3 md:gap-4 ${columnas[Math.min(fotos.length, 4)] || ""}`}>
        {fotos.map((img, i) => (
          <img
            key={img.id ?? i}
            src={foto(img, 1000)}
            srcSet={srcSet(img, [480, 1000, 1400])}
            sizes="(min-width: 768px) 30vw, 50vw"
            alt={img.alt || ""}
            style={{ objectPosition: encuadre(img) }}
            loading="lazy"
            className="aparece aspect-[4/3] w-full object-cover"
          />
        ))}
      </div>
    </section>
  );
}
