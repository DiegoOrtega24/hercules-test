import Link from "next/link";
import { enlace } from "@/lib/utilidades";

// Botón normal (rojo) + botón secundario (blanco), según la Guía Web Tours.
// Ej.: "Reservar" + "Conocer más", o "Comprar ahora" + "Conocer más".
export default function Acciones({ blok, className = "" }) {
  const principal = enlace(blok.button_link);
  const secundario = enlace(blok.link);
  const externo = (url) => (url?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
  if (!(principal && blok.button_label) && !(secundario && blok.link_label)) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      {principal && blok.button_label && (
        <Link
          href={principal}
          {...externo(principal)}
          className="boton"
        >
          {blok.button_label}
        </Link>
      )}
      {secundario && blok.link_label && (
        <Link href={secundario} {...externo(secundario)} className="boton-secundario">
          {blok.link_label}
        </Link>
      )}
    </div>
  );
}
