"use client";
import { useRef } from "react";

// Pista horizontal con scroll suave: en celular se desliza con el dedo,
// en laptop también con las flechas.
export default function Carril({ cabecera, etiqueta, anterior, siguiente, children }) {
  const pista = useRef(null);

  const mover = (direccion) => {
    const el = pista.current;
    if (!el) return;
    const primera = el.firstElementChild;
    const paso = primera ? primera.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direccion * paso, behavior: "smooth" });
  };

  const flecha = "flex size-11 items-center justify-center border border-carbon/30 transition-colors hover:bg-carbon hover:text-crema";

  return (
    <div>
      <div className="contenedor mb-6 flex items-end justify-between gap-8 md:mb-8">
        <div className="flex-1">{cabecera}</div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" aria-label={anterior} onClick={() => mover(-1)} className={flecha}>←</button>
          <button type="button" aria-label={siguiente} onClick={() => mover(1)} className={flecha}>→</button>
        </div>
      </div>
      <div
        ref={pista}
        role="region"
        aria-label={etiqueta}
        tabIndex={0}
        className="carril flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {children}
      </div>
    </div>
  );
}
