import { getStoryblokApi, storyblokConectado } from "./storyblok";
import { idiomaBase, traducirLocal } from "./i18n";
import { cervezaLocal } from "./cervezas";

import home from "@/storyblok/paginas/home.json";
import cerveceria from "@/storyblok/paginas/cerveceria.json";
import jardin from "@/storyblok/paginas/jardin.json";
import hotel from "@/storyblok/paginas/hotel.json";
import almacen from "@/storyblok/paginas/almacen.json";
import tours from "@/storyblok/paginas/tours.json";
import venues from "@/storyblok/paginas/venues.json";
import historia from "@/storyblok/paginas/historia.json";
import configuracion from "@/storyblok/paginas/configuracion.json";

// Contenido del modo demo (sin token de Storyblok)
const locales = { home, cerveceria, jardin, hotel, almacen, tours, venues, historia, configuracion };

export async function cargarHistoria(slug, lang) {
  if (!storyblokConectado) {
    if (slug.startsWith("cervezas/")) return cervezaLocal(slug.replace("cervezas/", ""), lang);
    const contenido = locales[slug];
    return contenido ? { name: slug, full_slug: slug, content: traducirLocal(contenido, lang) } : null;
  }
  try {
    const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, {
      version: process.env.STORYBLOK_VERSION || "draft",
      ...(lang !== idiomaBase && { language: lang }),
    });
    return data.story;
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}

// Menú, pie de página y redes (historia "configuracion" en Storyblok)
export async function cargarConfig(lang) {
  const story = await cargarHistoria("configuracion", lang).catch(() => null);
  const c = story?.content || traducirLocal(configuracion, lang);
  const aRutas = (links = []) =>
    links.map((l) => ({ nombre: l.label, link: l.link })).filter((l) => l.nombre);
  return {
    menu: aRutas(c.menu),
    secundario: aRutas(c.secondary_menu),
    direccion: c.address || "",
    instagram: c.instagram || "",
    facebook: c.facebook || "",
    correo: c.email || "",
  };
}
