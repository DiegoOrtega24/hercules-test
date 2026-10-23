export const idiomas = ["es", "en"];
export const idiomaBase = "es";

export const esIdioma = (x) => idiomas.includes(x);

// Textos fijos de la interfaz (lo demás se edita en Storyblok)
export const textos = {
  es: {
    menu: "Menú",
    cerrar: "Cerrar",
    inicio: "Inicio, Compañía Cervecera Hércules",
    idioma: "Idioma",
    secciones: "Secciones",
    construccionTitulo: "Esta página todavía no existe en Storyblok.",
    construccionTexto:
      "Para crearla, agrega una historia con la ruta “{slug}” y ármala con los bloques del sitio.",
    volver: "Volver al inicio",
    configTitulo: "Configuración del sitio",
    configTexto:
      "Esta historia controla el menú, el pie de página y las redes. Guarda los cambios y recarga para verlos arriba y abajo.",
  },
  en: {
    menu: "Menu",
    cerrar: "Close",
    inicio: "Home, Compañía Cervecera Hércules",
    idioma: "Language",
    secciones: "Sections",
    construccionTitulo: "This page doesn't exist in Storyblok yet.",
    construccionTexto: "To create it, add a story with the slug “{slug}” and build it with the site's blocks.",
    volver: "Back to home",
    configTitulo: "Site settings",
    configTexto:
      "This story controls the menu, footer and social links. Save and reload to see the changes.",
  },
};

// Modo demo: Storyblok guarda cada traducción como "campo__i18n__en".
// Esta función deja el contenido local igual a como lo entrega la API.
export function traducirLocal(nodo, lang) {
  if (Array.isArray(nodo)) return nodo.map((n) => traducirLocal(n, lang));
  if (!nodo || typeof nodo !== "object") return nodo;
  const salida = {};
  for (const [clave, valor] of Object.entries(nodo)) {
    if (clave.includes("__i18n__")) continue;
    const traducido = nodo[`${clave}__i18n__${lang}`];
    const usar = lang !== idiomaBase && traducido !== undefined && traducido !== "" ? traducido : valor;
    salida[clave] = traducirLocal(usar, lang);
  }
  return salida;
}
