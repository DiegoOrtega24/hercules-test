// Carga inicial del demo en Storyblok:
//   1. Activa el inglés en el espacio (traducción por campo)
//   2. Crea (o actualiza) los bloques del sitio: page, hero, feature, cards...
//   3. Sube las fotos de /public/fotos a la biblioteca de Storyblok
//   4. Crea (o reemplaza) cada página de storyblok/paginas y la publica
//
// Uso: completa .env.local (ver .env.example) y corre:  npm run seed
// Se puede correr varias veces; actualiza lo que ya existe.

import fs from "node:fs";
import path from "node:path";

const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN;
const ESPACIO = process.env.STORYBLOK_SPACE_ID;
const REGION = (process.env.STORYBLOK_REGION || "eu").toLowerCase();
const SITIO = process.env.SITE_URL; // opcional: https://tu-proyecto.vercel.app

const HOSTS = {
  eu: "https://mapi.storyblok.com",
  us: "https://api-us.storyblok.com",
  ca: "https://api-ca.storyblok.com",
  ap: "https://api-ap.storyblok.com",
  cn: "https://app.storyblokchina.cn",
};

if (!TOKEN || !ESPACIO) {
  console.error("Falta STORYBLOK_PERSONAL_TOKEN o STORYBLOK_SPACE_ID en .env.local");
  process.exit(1);
}
if (!HOSTS[REGION]) {
  console.error(`Región desconocida "${REGION}". Usa: ${Object.keys(HOSTS).join(", ")}`);
  process.exit(1);
}

const BASE = `${HOSTS[REGION]}/v1/spaces/${ESPACIO}`;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(metodo, ruta, cuerpo) {
  for (let intento = 0; intento < 5; intento++) {
    const res = await fetch(BASE + ruta, {
      method: metodo,
      headers: { Authorization: TOKEN, "Content-Type": "application/json" },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    if (res.status === 429) {
      await esperar(1000 * (intento + 1)); // límite de solicitudes: reintenta
      continue;
    }
    const texto = await res.text();
    if (!res.ok) throw new Error(`${metodo} ${ruta} respondió ${res.status}: ${texto}`);
    await esperar(350);
    return texto ? JSON.parse(texto) : {};
  }
  throw new Error(`${metodo} ${ruta}: demasiadas solicitudes, intenta de nuevo en un minuto`);
}

// Ancho y alto de un JPG (Storyblok los usa en la URL de la foto)
function medidasJpg(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marca = buf[i + 1];
    const largo = buf.readUInt16BE(i + 2);
    if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) {
      return { alto: buf.readUInt16BE(i + 5), ancho: buf.readUInt16BE(i + 7) };
    }
    i += 2 + largo;
  }
  return { ancho: 0, alto: 0 };
}

// ---------- 1. Bloques ----------
async function bloques() {
  const definidos = JSON.parse(fs.readFileSync("storyblok/components.json", "utf8"));
  const { components: existentes = [] } = await api("GET", "/components/");
  for (const comp of definidos) {
    const actual = existentes.find((c) => c.name === comp.name);
    if (actual) {
      await api("PUT", `/components/${actual.id}`, { component: { ...actual, ...comp } });
      console.log(`  bloque actualizado: ${comp.name}`);
    } else {
      await api("POST", "/components/", { component: comp });
      console.log(`  bloque creado: ${comp.name}`);
    }
  }
}

// ---------- 2. Fotos ----------
const subidas = new Map();

async function subirFoto(rutaPublica) {
  if (subidas.has(rutaPublica)) return subidas.get(rutaPublica);
  const archivo = path.join("public", rutaPublica);
  const nombre = path.basename(archivo);
  const buffer = fs.readFileSync(archivo);
  const { ancho, alto } = nombre.endsWith(".jpg") ? medidasJpg(buffer) : { ancho: 0, alto: 0 };

  const firmado = await api("POST", "/assets/", { filename: nombre, size: `${ancho}x${alto}` });
  const form = new FormData();
  for (const [k, v] of Object.entries(firmado.fields || {})) form.append(k, v);
  const tipo = nombre.endsWith(".svg") ? "image/svg+xml" : nombre.endsWith(".png") ? "image/png" : "image/jpeg";
  form.append("file", new Blob([buffer], { type: tipo }), nombre);
  const s3 = await fetch(firmado.post_url, { method: "POST", body: form });
  if (!s3.ok) throw new Error(`no se pudo subir ${nombre} (${s3.status})`);
  if (firmado.id) await api("GET", `/assets/${firmado.id}/finish_upload`);

  let url = firmado.pretty_url || firmado.public_url;
  if (url.startsWith("//")) url = `https:${url}`;
  const asset = { id: firmado.id ?? null, filename: url };
  subidas.set(rutaPublica, asset);
  console.log(`  foto subida: ${nombre}`);
  return asset;
}

// Recorre el contenido y cambia cada foto local por la foto en Storyblok
async function cambiarFotos(nodo) {
  if (Array.isArray(nodo)) {
    for (const n of nodo) await cambiarFotos(n);
    return;
  }
  if (!nodo || typeof nodo !== "object") return;
  if (nodo.fieldtype === "asset" && nodo.filename?.startsWith("/") && fs.existsSync(path.join("public", nodo.filename))) {
    try {
      Object.assign(nodo, await subirFoto(nodo.filename));
    } catch (e) {
      // Si falla la subida, la foto se sirve desde el propio sitio
      console.warn(`  aviso: ${e.message}. Se usará la foto del sitio.`);
      nodo.id = null;
      if (SITIO) nodo.filename = `${SITIO.replace(/\/$/, "")}${nodo.filename}`;
    }
    return;
  }
  for (const v of Object.values(nodo)) await cambiarFotos(v);
}

// ---------- 4. Páginas ----------
const NOMBRES = {
  home: "Home",
  cerveceria: "Cervecería",
  jardin: "Jardín de cerveza",
  hotel: "Hotel",
  almacen: "Almacén",
  tours: "Tours",
  venues: "Venues",
  historia: "Historia",
  configuracion: "Configuración del sitio",
};

async function paginas(solo) {
  for (const archivo of fs.readdirSync("storyblok/paginas").filter((f) => f.endsWith(".json"))) {
    const slug = archivo.replace(".json", "");
    if (solo && !solo.includes(slug)) continue;
    const contenido = JSON.parse(fs.readFileSync(`storyblok/paginas/${archivo}`, "utf8"));
    await cambiarFotos(contenido);
    const story = { name: NOMBRES[slug] || slug, slug, content: contenido };

    const { stories = [] } = await api("GET", `/stories/?with_slug=${slug}`);
    if (stories[0]) {
      await api("PUT", `/stories/${stories[0].id}`, { story, publish: 1 });
      console.log(`  página actualizada: ${slug}`);
    } else {
      await api("POST", "/stories/", { story, publish: 1 });
      console.log(`  página creada: ${slug}`);
    }
  }
}

// ---------- 5. Cervezas ----------
// Carpeta "Cervezas" (las entradas nuevas ahí ya son de tipo Cerveza) y una
// historia por cerveza de storyblok/cervezas.json.
async function cervezas() {
  const lista = JSON.parse(fs.readFileSync("storyblok/cervezas.json", "utf8"));
  const { stories: carpetas = [] } = await api("GET", "/stories/?with_slug=cervezas");
  let carpeta = carpetas[0];
  if (!carpeta) {
    ({ story: carpeta } = await api("POST", "/stories/", {
      story: { name: "Cervezas", slug: "cervezas", is_folder: true, default_root: "cerveza" },
    }));
    console.log("  carpeta creada: cervezas");
  }
  for (const c of lista) {
    const contenido = structuredClone(c.content);
    await cambiarFotos(contenido);
    const story = { name: c.name, slug: c.slug, parent_id: carpeta.id, position: c.position, content: contenido };
    const { stories = [] } = await api("GET", `/stories/?with_slug=cervezas/${c.slug}`);
    if (stories[0]) {
      await api("PUT", `/stories/${stories[0].id}`, { story, publish: 1 });
      console.log(`  cerveza actualizada: ${c.name}`);
    } else {
      await api("POST", "/stories/", { story, publish: 1 });
      console.log(`  cerveza creada: ${c.name}`);
    }
  }
}

// ---------- 1. Inglés ----------
async function ingles() {
  try {
    const { space } = await api("GET", "");
    const actuales = space?.languages || [];
    if (actuales.some((l) => l.code === "en")) {
      console.log("  el inglés ya estaba activo");
      return;
    }
    await api("PUT", "", { space: { languages: [...actuales, { code: "en", name: "English" }] } });
    console.log("  inglés activado");
  } catch (e) {
    console.warn(
      "  aviso: no pude activar el inglés automáticamente. Hazlo en Settings → Internationalization → Add language: English (código en)."
    );
  }
}

// ---------- Opcional: URL de vista previa del Editor Visual ----------
async function vistaPrevia() {
  if (!SITIO) return;
  try {
    await api("PUT", "", { space: { domain: `${SITIO.replace(/\/$/, "")}/` } });
    console.log(`  vista previa apuntando a ${SITIO}`);
  } catch (e) {
    console.warn(`  aviso: configura la vista previa a mano (${e.message})`);
  }
}

console.log(`Espacio ${ESPACIO} (región ${REGION})`);
// npm run seed:bloques  ->  solo actualiza los bloques, sin tocar el contenido
const argPaginas = process.argv.find((a) => a.startsWith("--pagina="));
if (argPaginas) {
  // npm run seed:pagina -- --pagina=home,jardin -> bloques + solo esas páginas
  const solo = argPaginas.split("=")[1].split(",").map((s) => s.trim());
  console.log(`Bloques y páginas: ${solo.join(", ")} (lo demás no se toca)`);
  await bloques();
  await paginas(solo);
  console.log("Listo.");
} else if (process.argv.includes("--solo-cervezas")) {
  // npm run seed:cervezas -> bloques + cervezas de ejemplo, sin tocar las páginas
  console.log("Bloques y cervezas (las páginas no se tocan)");
  await bloques();
  await cervezas();
  console.log("Listo. Revisa la carpeta Cervezas en Content.");
} else if (process.argv.includes("--solo-bloques")) {
  console.log("Solo bloques (el contenido no se toca)");
  await bloques();
  console.log("Listo. Los bloques están actualizados.");
} else {
  console.log("1/3 Idiomas");
  await ingles();
  console.log("2/3 Bloques");
  await bloques();
  console.log("3/3 Fotos, páginas y cervezas");
  await paginas();
  await cervezas();
  await vistaPrevia();
  console.log("Listo. Abre Content en Storyblok: verás las 7 páginas y la configuración.");
}
