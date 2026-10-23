import Link from "next/link";
import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import { enlace } from "@/lib/utilidades";

// Datos prácticos: horarios, dirección, capacidad...
export default function Details({ blok }) {
  const href = enlace(blok.link);
  const externo = href?.startsWith("http");
  return (
    <section {...storyblokEditable(blok)} className="py-10 md:py-16">
      <div className="aparece contenedor grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1]">{blok.title}</h2>
          {href && blok.link_label && (
            <Link
              href={href}
              {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
              className="mt-6 inline-block border-b border-current pb-0.5 font-medium"
            >
              {blok.link_label}
            </Link>
          )}
        </div>
        <dl className="md:col-span-6 md:col-start-7">
          {blok.rows?.map((fila) => (
            <StoryblokServerComponent blok={fila} key={fila._uid} />
          ))}
        </dl>
      </div>
    </section>
  );
}
