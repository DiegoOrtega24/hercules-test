"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { idiomas } from "@/lib/i18n";
import { ALTO, ANCHO, LINEA, SILUETA } from "./hercules-icono";

// Botón de menú: el Hércules del mural. Cerrado está vacío; al abrir el
// menú se llena de cerveza y la línea toma el rojo ladrillo del mural.
function IconoMenu({ abierto }) {
  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="h-11 w-auto" aria-hidden="true">
      <defs>
        <clipPath id="hercules-menu">
          <path d={SILUETA} />
        </clipPath>
      </defs>
      <g clipPath="url(#hercules-menu)">
        <rect
          width={ANCHO}
          height={ALTO}
          fill="var(--color-ambar)"
          style={{
            transformBox: "view-box",
            transform: abierto ? "translateY(0)" : `translateY(${ALTO}px)`,
            transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </g>
      <path
        d={LINEA}
        style={{ fill: abierto ? "var(--color-ladrillo)" : "currentColor", transition: "fill 300ms" }}
      />
    </svg>
  );
}

// Misma página en el otro idioma: /es/hotel -> /en/hotel
function rutaEn(ruta, lang) {
  const resto = ruta.replace(/^\/(es|en)(?=\/|$)/, "");
  return `/${lang}${resto}`;
}

function SelectorIdioma({ ruta, lang, t }) {
  return (
    <ul aria-label={t.idioma} className="flex gap-3">
      {idiomas.map((l) => (
        <li key={l}>
          <Link
            href={rutaEn(ruta, l)}
            hrefLang={l}
            aria-current={l === lang ? "true" : undefined}
            className="uppercase opacity-60 aria-[current=true]:opacity-100 aria-[current=true]:underline decoration-1 underline-offset-6"
          >
            {l}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Nav({ lang, menu, t }) {
  const ruta = usePathname();
  const inicio = ruta === `/${lang}` || ruta === `/${lang}/home`;
  const [abierto, setAbierto] = useState(false);

  // Se cierra con Escape y al pasar a pantalla de laptop
  useEffect(() => {
    if (!abierto) return;
    const conTecla = (e) => e.key === "Escape" && setAbierto(false);
    const ancho = window.matchMedia("(min-width: 48rem)");
    const conAncho = () => ancho.matches && setAbierto(false);
    window.addEventListener("keydown", conTecla);
    ancho.addEventListener("change", conAncho);
    return () => {
      window.removeEventListener("keydown", conTecla);
      ancho.removeEventListener("change", conAncho);
    };
  }, [abierto]);

  return (
    <header
      className={
        inicio
          ? `absolute inset-x-0 top-0 z-20 transition-colors duration-500 ${abierto ? "bg-crema text-carbon" : "text-crema"}`
          : "relative bg-crema text-carbon"
      }
    >
      <div className="contenedor flex items-center justify-between py-5">
        {/* En la Home el logo grande ya está en la portada */}
        <Link href={`/${lang}`} aria-label={t.inicio} className={inicio && !abierto ? "invisible" : ""}>
          <span className="logo w-14" />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <nav aria-label="Principal">
            <ul className="flex gap-7">
              {menu.map((m) => (
                <li key={m.ruta}>
                  <Link
                    href={m.ruta}
                    aria-current={ruta === m.ruta ? "page" : undefined}
                    className="decoration-1 underline-offset-6 hover:underline aria-[current=page]:underline"
                  >
                    {m.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SelectorIdioma ruta={ruta} lang={lang} t={t} />
        </div>

        <button
          type="button"
          className="-my-2 -mr-1 p-1 md:hidden"
          aria-label={abierto ? t.cerrar : t.menu}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto(!abierto)}
        >
          <IconoMenu abierto={abierto} />
        </button>
      </div>

      {/* Siempre está en la página; al abrir se despliega con suavidad.
          "inert" evita que se pueda navegar con teclado cuando está cerrado. */}
      <div
        id="menu-movil"
        inert={!abierto}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Principal" className="contenedor pb-10 pt-4 text-carbon">
            <ul className="flex flex-col gap-3 font-display text-3xl">
              {menu.map((m, i) => (
                <li
                  key={m.ruta}
                  // Cada opción aparece un poco después de la anterior
                  className={`transition duration-500 ease-out ${
                    abierto ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: abierto ? `${100 + i * 50}ms` : "0ms" }}
                >
                  <Link href={m.ruta} onClick={() => setAbierto(false)}>
                    {m.nombre}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className={`mt-8 transition duration-500 ease-out ${abierto ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: abierto ? `${100 + menu.length * 50}ms` : "0ms" }}
            >
              <SelectorIdioma ruta={ruta} lang={lang} t={t} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
