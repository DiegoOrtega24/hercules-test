"use client";
import { useEffect, useRef } from "react";
import { ALTO, ANCHO, LINEA, SILUETA } from "./hercules-trazos";

const ESPUMA = 34; // grosor de la espuma, en unidades del dibujo

// El Hércules del mural, fijo arriba a la derecha. Empieza vacío (crema)
// y se va llenando de cerveza ámbar, con su espuma, conforme bajas por la
// página. Al llegar casi al final queda igual que el mural de la fábrica.
export default function HerculesScroll() {
  const nivel = useRef(null);

  useEffect(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cuadro = 0;

    const actualizar = () => {
      cuadro = 0;
      const recorrido = document.documentElement.scrollHeight - window.innerHeight;
      // Se llena por completo al 85% del recorrido, antes del pie de página
      const lleno = reducir ? 1 : Math.min(1, Math.max(0, window.scrollY / (recorrido * 0.85 || 1)));
      nivel.current?.setAttribute("transform", `translate(0 ${(1 - lleno) * (ALTO + ESPUMA)})`);
    };
    const alMover = () => {
      if (!cuadro) cuadro = requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-24 z-30 w-12 md:right-10 md:w-[4.5rem] lg:right-16 lg:w-20"
    >
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="h-auto w-full">
        <defs>
          <clipPath id="hercules-silueta">
            <path d={SILUETA} />
          </clipPath>
        </defs>
        {/* Vacío: la figura en crema, aunque pase sobre una foto */}
        <path d={SILUETA} fill="var(--color-crema)" />
        {/* La cerveza sube dentro de la silueta */}
        <g clipPath="url(#hercules-silueta)">
          <g ref={nivel} transform={`translate(0 ${ALTO + ESPUMA})`}>
            <rect y={-ESPUMA} width={ANCHO} height={ESPUMA} fill="#fffdf5" />
            <rect width={ANCHO} height={ALTO} fill="var(--color-ambar)" />
          </g>
        </g>
        {/* La pintura roja del mural, siempre encima */}
        <path d={LINEA} fill="var(--color-ladrillo)" />
      </svg>
    </div>
  );
}
