import { notFound } from "next/navigation";
import "../globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { cargarConfig } from "@/lib/contenido";
import { enlace } from "@/lib/utilidades";
import { esIdioma, idiomas, textos } from "@/lib/i18n";

export function generateStaticParams() {
  return idiomas.map((lang) => ({ lang }));
}

export const metadata = {
  title: "Compañía Cervecera Hércules",
  description: "Cervecería, jardín de cerveza y hotel en una fábrica textil de 1846 en Querétaro.",
};

export default async function Layout({ children, params }) {
  const { lang } = await params;
  if (!esIdioma(lang)) notFound();

  const config = await cargarConfig(lang);
  const menu = config.menu.map((m) => ({ nombre: m.nombre, ruta: enlace(m.link, lang) }));
  const secundario = config.secundario.map((m) => ({ nombre: m.nombre, ruta: enlace(m.link, lang) }));

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;1,500&display=swap"
        />
      </head>
      <body>
        <Nav lang={lang} menu={menu} t={textos[lang]} />
        <main>{children}</main>
        <Footer lang={lang} menu={[...menu, ...secundario]} config={config} t={textos[lang]} />
      </body>
    </html>
  );
}
