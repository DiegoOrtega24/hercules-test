import { getStoryblokApi } from "@storyblok/react/rsc";
import { idiomaBase, traducirLocal } from "./i18n";
import locales from "@/storyblok/cervezas.json";

const conectado = Boolean(process.env.STORYBLOK_PREVIEW_TOKEN);

// Cervezas de la carpeta "cervezas" de Storyblok (o las de ejemplo en modo demo).
// filtro: "todas" | "linea" | "temporada"
export async function cargarCervezas(lang, filtro = "todas", limite) {
  let lista;
  if (!conectado) {
    lista = locales.map((c) => ({ slug: c.slug, content: traducirLocal(c.content, lang) }));
  } else {
    const { data } = await getStoryblokApi().get("cdn/stories", {
      version: process.env.STORYBLOK_VERSION || "draft",
      starts_with: "cervezas/",
      content_type: "cerveza",
      sort_by: "position:asc",
      per_page: 100,
      ...(lang !== idiomaBase && { language: lang }),
    });
    lista = data.stories.map((s) => ({ slug: s.slug, content: s.content }));
  }
  lista = lista.filter((c) => c.content.available !== false);
  if (filtro && filtro !== "todas") lista = lista.filter((c) => c.content.line === filtro);
  const max = Number(limite);
  return max > 0 ? lista.slice(0, max) : lista;
}

// Una cerveza de ejemplo (solo modo demo; con Storyblok la carga la ruta normal)
export function cervezaLocal(slug, lang) {
  const c = locales.find((x) => x.slug === slug);
  return c ? { name: c.name, full_slug: `cervezas/${c.slug}`, content: traducirLocal(c.content, lang) } : null;
}

// Color aproximado de una cerveza según su SRM (escala estándar del 1 al 40)
const SRM = ["#FFE699","#FFD878","#FFCA5A","#FFBF42","#FBB123","#F8A600","#F39C00","#EA8F00","#E58500","#DE7C00",
  "#D77200","#CF6900","#CB6200","#C35900","#BB5100","#B54C00","#B04500","#A63E00","#A13700","#9B3200",
  "#952D00","#8E2900","#882300","#821E00","#7B1A00","#771900","#701400","#6A0E00","#660D00","#5E0B00",
  "#5A0A02","#600903","#520907","#4C0505","#470606","#440607","#3F0708","#3B0607","#3A070B","#36080A"];

export function colorSrm(valor) {
  const n = Math.round(Number(valor));
  if (!n || n < 1) return null;
  return SRM[Math.min(n, 40) - 1];
}
