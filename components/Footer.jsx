import Link from "next/link";

export default function Footer({ menu, config, t }) {
  const redes = [
    { nombre: "Instagram", url: config.instagram },
    { nombre: "Facebook", url: config.facebook },
  ].filter((r) => r.url);

  return (
    <footer className="bg-carbon pb-10 pt-16 text-crema md:pt-20">
      <div className="contenedor grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <span role="img" aria-label="Compañía Cervecera Hércules" className="logo w-24" />
        </div>
        <nav aria-label={t.secciones} className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
            {menu.map((m) => (
              <li key={m.ruta}>
                <Link href={m.ruta} className="decoration-1 underline-offset-4 hover:underline">
                  {m.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-5 md:col-span-4">
          {config.direccion && <address className="whitespace-pre-line not-italic">{config.direccion}</address>}
          {config.correo && (
            <p>
              <a href={`mailto:${config.correo}`} className="hover:underline">
                {config.correo}
              </a>
            </p>
          )}
          {redes.length > 0 && (
            <ul className="flex gap-5">
              {redes.map((r) => (
                <li key={r.nombre}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {r.nombre}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="contenedor mt-16 text-sm text-crema/60">
        © {new Date().getFullYear()} Compañía Cervecera Hércules
      </p>
    </footer>
  );
}
