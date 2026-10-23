import { storyblokEditable } from "@storyblok/react/rsc";
import NewsletterForm from "./NewsletterForm";
import { fondos } from "./Cta";

export default function Newsletter({ blok }) {
  const estilo = fondos[blok.background] || fondos["arena-textura"];
  const oscuro = estilo.seccion.includes("text-crema");
  return (
    <section {...storyblokEditable(blok)} className={`mt-8 py-16 md:mt-12 md:py-24 ${estilo.seccion}`}>
      <div className="aparece contenedor grid gap-10 md:grid-cols-12 md:items-end md:gap-12">
        <div className="md:col-span-6">
          <h2 className="font-display text-[clamp(2rem,3.8vw,3.5rem)] leading-[1.02]">{blok.title}</h2>
          {blok.text && <p className="mt-4 max-w-[42ch] opacity-85">{blok.text}</p>}
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <NewsletterForm
            boton={blok.button_label || "Suscribirme"}
            placeholder={blok.placeholder || "tu@correo.com"}
            gracias={blok.success_message || "Listo, te escribiremos cuando haya algo nuevo."}
            oscuro={oscuro}
          />
        </div>
      </div>
    </section>
  );
}
