"use client";
import { useEffect, useRef, useState } from "react";

// Fotos de la portada. Con una sola foto, queda fija. Con varias, cambian
// solas cada 5.5 s con un fundido; se pueden elegir con los puntos, pausar,
// o deslizar con el dedo a la izquierda o derecha en el celular.
export default function HeroFotos({ fotos, t }) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const varias = fotos.length > 1;
  const ancla = useRef(null);

  // Cambio automático. Se reinicia cada vez que cambia la foto, así que
  // después de deslizar o tocar un punto vuelve a esperar 5.5 s completos.
  useEffect(() => {
    if (!varias || pausa) return;
    const id = setTimeout(() => setActual((x) => (x + 1) % fotos.length), 5500);
    return () => clearTimeout(id);
  }, [actual, varias, pausa, fotos.length]);

  // Deslizar con el dedo sobre la portada: a la izquierda la siguiente foto,
  // a la derecha la anterior. El scroll vertical de la página sigue normal.
  useEffect(() => {
    const zona = ancla.current?.parentElement;
    if (!zona || !varias) return;
    let x0 = null;
    let y0 = null;
    const alTocar = (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const alSoltar = (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        setActual((a) => (a + (dx < 0 ? 1 : -1) + fotos.length) % fotos.length);
      }
    };
    zona.addEventListener("touchstart", alTocar, { passive: true });
    zona.addEventListener("touchend", alSoltar, { passive: true });
    return () => {
      zona.removeEventListener("touchstart", alTocar);
      zona.removeEventListener("touchend", alSoltar);
    };
  }, [varias, fotos.length]);

  return (
    <>
      <span ref={ancla} hidden />
      {fotos.map((f, k) => (
        <img
          key={f.src}
          src={f.src}
          srcSet={f.srcSet}
          sizes="100vw"
          alt={k === actual ? f.alt : ""}
          aria-hidden={k !== actual}
          fetchPriority={k === 0 ? "high" : "low"}
          loading="eager"
          style={{ objectPosition: f.pos }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            k === actual ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {varias && (
        <div className="absolute inset-x-0 bottom-5 z-10 md:bottom-8">
          <div className="contenedor flex items-center justify-end gap-3">
            {fotos.map((f, k) => (
              <button
                key={f.src}
                type="button"
                aria-label={`${t.foto} ${k + 1}`}
                aria-current={k === actual ? "true" : undefined}
                onClick={() => setActual(k)}
                className="group/punto flex h-6 items-center"
              >
                <span
                  className={`block h-[3px] rounded-full bg-crema transition-all duration-500 ${
                    k === actual ? "w-10 opacity-100" : "w-5 opacity-50 group-hover/punto:opacity-80"
                  }`}
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPausa(!pausa)}
              aria-label={pausa ? t.reanudar : t.pausar}
              className="ml-1 flex size-6 items-center justify-center text-crema/80 hover:text-crema"
            >
              {pausa ? (
                <svg viewBox="0 0 10 12" className="h-3 w-3 fill-current" aria-hidden="true"><path d="M0 0l10 6-10 6z" /></svg>
              ) : (
                <svg viewBox="0 0 10 12" className="h-3 w-3 fill-current" aria-hidden="true"><path d="M0 0h3v12H0zM7 0h3v12H7z" /></svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
