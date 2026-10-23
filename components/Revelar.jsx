"use client";
import { useEffect, useRef, useState } from "react";

// Marca su contenido con data-revelado="true" la primera vez que cruza la
// parte media de la pantalla. Los hijos usan clases
// "group-data-[revelado=true]/nombre:..." para animarse en ese momento.
export default function Revelar({ as: Etiqueta = "div", children, ...props }) {
  const ref = useRef(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisto(true);
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisto(true);
          observador.disconnect();
        }
      },
      // Se activa cuando el elemento entra a la franja media de la pantalla
      { rootMargin: "0px 0px -35% 0px", threshold: 0.5 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta ref={ref} data-revelado={visto} {...props}>
      {children}
    </Etiqueta>
  );
}
