"use client";
import { useEffect, useRef, useState } from "react";

// En pantallas táctiles: al apoyar el dedo sobre el elemento se marca con
// data-activo="true" (como el hover con mouse) y se queda así hasta que se
// toca otra cosa. Así solo hay uno abierto a la vez, como en Mikkeller.
export default function Tocable({ as: Etiqueta = "div", children, ...props }) {
  const ref = useRef(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alTocar = (e) => {
      if (e.pointerType === "mouse") return;
      setActivo(el.contains(e.target));
    };
    document.addEventListener("pointerdown", alTocar, { passive: true });
    return () => document.removeEventListener("pointerdown", alTocar);
  }, []);

  return (
    <Etiqueta ref={ref} data-activo={activo} {...props}>
      {children}
    </Etiqueta>
  );
}
