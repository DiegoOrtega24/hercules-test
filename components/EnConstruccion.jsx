import Link from "next/link";

export default function EnConstruccion({ titulo, texto, lang, t }) {
  return (
    <section className="min-h-[60vh] pb-32 pt-16">
      <div className="contenedor">
        <h1 className="max-w-[22ch] font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05]">
          {titulo}
        </h1>
        <p className="mt-6 max-w-[48ch] text-lg text-carbon/80">{texto}</p>
        <Link href={`/${lang}`} className="mt-10 inline-block border-b border-current pb-0.5 font-medium">
          {t.volver}
        </Link>
      </div>
    </section>
  );
}
