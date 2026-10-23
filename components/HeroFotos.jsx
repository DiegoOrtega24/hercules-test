"use client";
import { useEffect, useState } from "react";

// Fotos de la portada. Con una sola foto, queda fija. Con varias, cambian
// solas cada 5.5 s con un fundido; se pueden elegir con los puntos y pausar.
export default function HeroFotos({ fotos, t }) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const varias = fotos.length > 1;

  useEffect(() => {
    if (!varias || pausa) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActual((x) => (x + 1) % fotos.length), 5500);
    return () => clearInterval(id);
  }, [varias, pausa, fotos.length]);

  return (
    <>
      {fotos.map((f, k) => (
        <img
          key={f.src}
          src={f.src}
          srcSet={f.srcSet}
          sizes="100vw"
          alt={k === actual ? f.alt : ""}
          aria-hidden={k !== actual}
          fetchPriority={k === 0 ? "high" : "low"}
          loading={k === 0 ? "eager" : "lazy"}
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
