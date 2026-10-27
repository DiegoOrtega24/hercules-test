"use client";
import { useEffect, useRef } from "react";
import { ALTO, ANCHO, LINEA, SILUETA } from "./hercules-trazos";

const ESPUMA = 34; // grosor de la espuma, en unidades del dibujo

// El Hércules del mural, a la derecha de la portada. Se queda pegado
// mientras recorres la portada y se va llenando de cerveza ámbar, con su
// espuma. Cuando la portada termina, ya lleno, se va con ella: nunca queda
// encima del texto del resto de la página.
export default function HerculesScroll() {
  const columna = useRef(null);
  const figura = useRef(null);
  const nivel = useRef(null);

  useEffect(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cuadro = 0;

    const actualizar = () => {
      cuadro = 0;
      if (!columna.current || !figura.current) return;
      const caja = columna.current.getBoundingClientRect();
      const pegado = parseFloat(getComputedStyle(figura.current).top) || 0;
      const recorrido = caja.height - figura.current.offsetHeight;
      // 0 al inicio; 1 un poco antes de que la figura llegue al final de la portada
      const lleno = reducir ? 1 : Math.min(1, Math.max(0, (pegado - caja.top) / (recorrido * 0.9 || 1)));
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
      ref={columna}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-28 md:w-36 lg:w-44"
    >
      <div ref={figura} className="sticky top-6 md:top-10">
        <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="h-auto w-full">
          <defs>
            <clipPath id="hercules-silueta">
              <path d={SILUETA} />
            </clipPath>
          </defs>
          {/* Vacío: la figura en crema, aunque pase sobre la foto */}
          <path d={SILUETA} style={{ fill: "var(--color-crema)" }} />
          {/* La cerveza sube dentro de la silueta */}
          <g clipPath="url(#hercules-silueta)">
            <g ref={nivel} transform={`translate(0 ${ALTO + ESPUMA})`}>
              <rect y={-ESPUMA} width={ANCHO} height={ESPUMA} fill="#fffdf5" />
              <rect width={ANCHO} height={ALTO} style={{ fill: "var(--color-ambar)" }} />
            </g>
          </g>
          {/* La pintura roja del mural, siempre encima */}
          <path d={LINEA} style={{ fill: "var(--color-ladrillo)" }} />
        </svg>
      </div>
    </div>
  );
}
