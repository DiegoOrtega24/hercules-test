import { StoryblokServerComponent, StoryblokStory } from "@storyblok/react/rsc";
import { storyblokConectado } from "@/lib/storyblok";
import { cargarHistoria } from "@/lib/contenido";
import { prepararEnlaces } from "@/lib/utilidades";
import { esIdioma, idiomas, textos } from "@/lib/i18n";
import EnConstruccion from "@/components/EnConstruccion";

// Siempre pide el contenido más reciente, para que los cambios hechos en
// Storyblok se vean al momento durante el demo.
export const dynamic = "force-dynamic";

function slugDe(params) {
  const partes = params?.slug;
  return partes?.length ? partes.join("/") : "home";
}

// En el Editor Visual, Storyblok indica el idioma con ?_storyblok_lang=en
function idiomaDe(lang, searchParams) {
  const delEditor = searchParams?._storyblok_lang;
  return esIdioma(delEditor) ? delEditor : lang;
}

export async function generateMetadata({ params, searchParams }) {
  const p = await params;
  const lang = idiomaDe(p.lang, await searchParams);
  const slug = slugDe(p);
  const story = await cargarHistoria(slug, lang);
  const c = story?.content;
  const ruta = slug === "home" ? "" : `/${slug}`;
  return {
    title: c?.seo_title || (c?.name ? `${c.name} | Compañía Cervecera Hércules` : undefined),
    description: c?.seo_description || c?.description || undefined,
    // Le dice a Google que existe la misma página en el otro idioma
    alternates: {
      languages: Object.fromEntries(idiomas.map((l) => [l, `/${l}${ruta}`])),
    },
  };
}

export default async function Pagina({ params, searchParams }) {
  const p = await params;
  const lang = idiomaDe(p.lang, await searchParams);
  const slug = slugDe(p);

  if (slug === "configuracion") {
    const t = textos[lang];
    return <EnConstruccion titulo={t.configTitulo} texto={t.configTexto} lang={lang} t={t} />;
  }

  const story = await cargarHistoria(slug, lang);
  if (!story) {
    const t = textos[lang];
    return <EnConstruccion titulo={t.construccionTitulo} texto={t.construccionTexto.replace("{slug}", slug)} lang={lang} t={t} />;
  }

  const lista = { ...story, content: prepararEnlaces(story.content, lang) };
  if (!storyblokConectado) return <StoryblokServerComponent blok={lista.content} />;
  return <StoryblokStory story={lista} />;
}
