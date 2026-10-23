import { idiomas } from "./i18n";

// Fotos: si vienen de Storyblok usamos su servicio de imágenes para
// entregarlas al tamaño justo y en formato moderno.
export function foto(asset, ancho = 1600) {
  const url = asset?.filename;
  if (!url) return null;
  if (url.endsWith(".svg")) return url; // los SVG no pasan por el servicio de imágenes
  if (url.includes("storyblok.com") || url.includes("storyblokchina.cn")) {
    return `${url}/m/${ancho}x0/filters:quality(78)`;
  }
  return url;
}

export function srcSet(asset, anchos = [640, 1024, 1600, 2200]) {
  const url = asset?.filename;
  if (!url || !url.includes("storyblok") || url.endsWith(".svg")) return undefined;
  return anchos.map((a) => `${foto(asset, a)} ${a}w`).join(", ");
}

// Campo "link" de Storyblok (multilink) a una URL normal.
// Si es una ruta interna sin idioma, se le antepone el idioma actual
// (o, durante la edición en vivo, la redirige el archivo proxy.js).
export function enlace(link, lang) {
  if (!link) return null;
  if (link.href) return link.href;
  let url = null;
  if (link.linktype === "story") {
    const ruta = link.cached_url || link.story?.full_slug || "";
    url = ruta === "home" ? "/" : `/${ruta.replace(/^\//, "")}`;
  } else if (link.linktype === "email") {
    return `mailto:${link.email || link.url}`;
  } else {
    url = link.url || link.cached_url || null;
  }
  if (!url) return null;
  if (lang && url.startsWith("/") && !idiomas.some((l) => url === `/${l}` || url.startsWith(`/${l}/`))) {
    return url === "/" ? `/${lang}` : `/${lang}${url}`;
  }
  return url;
}

// Antes de pintar, agrega el idioma a todos los enlaces internos
export function prepararEnlaces(nodo, lang) {
  if (Array.isArray(nodo)) return nodo.map((n) => prepararEnlaces(n, lang));
  if (!nodo || typeof nodo !== "object") return nodo;
  const copia = {};
  for (const [k, v] of Object.entries(nodo)) copia[k] = prepararEnlaces(v, lang);
  if (nodo.fieldtype === "multilink") copia.href = enlace(nodo, lang);
  if (nodo.component) copia._idioma = lang; // para bloques que cargan datos (Lista de cervezas)
  return copia;
}

// Punto de enfoque de Storyblok: el editor marca con un clic lo importante
// de la foto (Asset → Focus point) y el recorte se centra ahí en vez del centro.
// Storyblok lo guarda como "x1xy1:x2xy2" en píxeles; el tamaño original
// viene en la URL (/f/espacio/ANCHOxALTO/...).
export function encuadre(asset) {
  const medidas = asset?.filename?.match(/\/(\d+)x(\d+)\//);
  const punto = asset?.focus?.match(/^(\d+)x(\d+):(\d+)x(\d+)$/);
  if (!medidas || !punto) return undefined;
  const [ancho, alto] = [Number(medidas[1]), Number(medidas[2])];
  const x = (Number(punto[1]) + Number(punto[3])) / 2;
  const y = (Number(punto[2]) + Number(punto[4])) / 2;
  return `${((x / ancho) * 100).toFixed(1)}% ${((y / alto) * 100).toFixed(1)}%`;
}
