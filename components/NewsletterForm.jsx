"use client";
import { useState } from "react";

// Demo: todavía no envía el correo a ningún servicio. En la fase 3 se
// conecta al servicio de newsletter que elija Hércules.
export default function NewsletterForm({ boton, placeholder, gracias, oscuro }) {
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <p role="status" className="text-lg">
        {gracias}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        autoComplete="email"
        aria-label={placeholder}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-b border-current bg-transparent py-3 text-lg placeholder:text-current placeholder:opacity-50 focus:outline-none focus-visible:border-b-2"
      />
      <button className="boton">
        {boton}
      </button>
    </form>
  );
}
