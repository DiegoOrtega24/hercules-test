# Sitio web · Compañía Cervecera Hércules

Next.js 16 + Tailwind CSS 4 + Storyblok, publicado en Vercel. Español e inglés.

El sitio funciona de dos maneras:

- **Modo demo** (sin token): muestra las 7 páginas con el contenido de `storyblok/paginas/`.
  Es tu respaldo si algo falla con Storyblok.
- **Conectado** (con `STORYBLOK_PREVIEW_TOKEN`): el contenido viene de Storyblok y se
  edita en vivo desde su Editor Visual.

## Tipografía: Monument

El sitio usa Monument Regular, Medium y Medium Italic. Es una fuente con licencia, así que
los archivos no vienen en el proyecto. Cópialos a `public/fonts/` con estos nombres exactos:

```
public/fonts/Monument-Regular.woff2
public/fonts/Monument-Medium.woff2
public/fonts/Monument-MediumItalic.woff2
```

Si tienes `.otf` o `.ttf`, conviértelos a `.woff2` (por ejemplo con transfonter.org) y revisa
que la licencia permita uso web. Mientras no estén, el sitio se ve con Archivo.

## Texturas

En `public/texturas/` están las fotos de muros de la fábrica, ya optimizadas:

| Archivo | Dónde se usa |
| --- | --- |
| `grano.jpg` | Grano casi invisible en todo el fondo crema (sale del muro verde) |
| `ladrillo.jpg` | Pie de página y fondo "Ladrillo", con capa carbón |
| `oxido.jpg` | Fondos "Óxido" (capa malta) y "Arena con textura" (capa arena) |
| `muro-agrietado.jpg` | Fondo "Muro", con capa olivo |
| `muro-verde.jpg` | Sin usar todavía |

Las llamadas a la acción y el newsletter tienen un campo **Fondo** en Storyblok para elegir
textura. Las capas de color se ajustan en `app/globals.css`, en las clases `.textura-*`.

## Hércules que se llena al hacer scroll

El mural de Hércules de la fábrica, vectorizado, aparece a la derecha del título de la
portada. Se queda pegado mientras se recorre la portada y se llena de cerveza (ámbar, con
espuma); al terminar la portada queda igual que el mural y se va con ella, sin encimarse
con el texto del resto de la página. Se activa en Storyblok con la casilla
**"Hércules que se llena al hacer scroll"** del bloque Portada (tamaño media). Viene activo
en Cervecería.

Archivos: `components/HerculesScroll.jsx` y `components/hercules-trazos.js`. Para otros usos
están `public/hercules.svg` (a color) y `public/hercules-linea.svg` (solo la línea).

## Cervezas

Cada cerveza es una entrada de tipo **Cerveza** dentro de la carpeta **Cervezas** en
Storyblok: nombre, foto de la lata (PNG con fondo transparente), estilo, % de alcohol, IBU,
SRM (el color se dibuja solo), descripción corta, notas, maridaje, si es de línea o de
temporada y si está disponible. Para agregar una: Content → Cervezas → + Create new.

- El bloque **Lista de cervezas** (en Cervecería) las muestra solas, en el orden de la
  carpeta, y se puede filtrar a solo de línea o solo de temporada.
- Cada cerveza tiene su página: `/es/cervezas/terricola`.
- Si se desmarca "Disponible", desaparece del sitio sin borrarla.

Para crear la carpeta y las cervezas de ejemplo sin tocar las páginas:

```bash
npm run seed:cervezas
```

Las latas de `public/cervezas/` son provisionales: hay que reemplazarlas en Storyblok por las
fotos reales.

## Carrusel y botones

- **Carrusel**: un carrete de fotos 4:3 que se desliza con el dedo (y con flechas en
  laptop). Cada foto puede llevar título, 2 o 3 líneas y dos botones, como el de Venues
  en la Home.
- **Sección con foto** y **Foto del carrusel** tienen botón principal (sólido, ej. Reservar,
  Comprar ahora) y enlace secundario (subrayado, ej. Conocer más).

## Reemplazar solo algunas páginas

```bash
npm run seed:pagina -- --pagina=home,jardin
```

Actualiza los bloques y reemplaza el contenido solo de esas páginas con el de
`storyblok/paginas/`. Las demás páginas, la configuración y las cervezas no se tocan.

## Actualizar solo los bloques

`npm run seed` reemplaza el contenido de las páginas. Cuando ya hay contenido editado en
Storyblok y solo cambiaron los bloques (un campo nuevo, por ejemplo), usa:

```bash
npm run seed:bloques
```

## Fotos: recortes y punto de enfoque

Cada bloque recorta la foto a un marco fijo (portada media 21:9 en laptop, secciones 4:3,
tarjetas y galería 4:5). No hay un tamaño obligatorio: para que no se corte lo importante,
en Storyblok se abre la foto en el campo, se elige **Focus point** y se hace clic en lo
importante. El recorte se centra ahí en todas las pantallas.

Tamaños recomendados para que se vean nítidas (no son obligatorios):

| Uso | Ancho mínimo |
| --- | --- |
| Portadas | 2400 px |
| Secciones con foto | 1800 px |
| Tarjetas y galería | 1200 px |

Storyblok entrega cada foto ya reducida y comprimida al tamaño de cada pantalla, así que
subir fotos grandes no hace lento el sitio.

## Páginas incluidas

| Ruta | Página | Bloques que usa |
| --- | --- | --- |
| /es | Home | Portada completa, texto destacado, 4 secciones con foto, galería, newsletter |
| /es/cerveceria | Cervecería | Portada, texto, tarjetas de cervezas, sección con foto, llamada a la acción |
| /es/jardin | Jardín de cerveza | Portada, texto destacado, galería, datos prácticos, llamada a la acción |
| /es/hotel | Hotel | Portada, texto, tarjetas de habitaciones, llamada a la acción |
| /es/tienda | Tienda en línea | Portada, tarjetas de productos, texto |
| /es/venues | Venues | Portada, texto destacado, tarjetas de espacios, datos prácticos, llamada a la acción |
| /es/historia | Historia | Portada, texto destacado, sección con foto, galería, texto, llamada a la acción |

Cada una existe también en inglés (`/en/...`). Eventos, Tours, Comunidad y Blog muestran
"esta página todavía no existe": así se ve cómo se agrega una página nueva.

## 1. Correrlo en tu computadora

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (te manda a `/es` o `/en` según tu navegador).

## 2. Actualizar GitHub y Vercel

Si ya tenías el demo anterior en GitHub, reemplaza los archivos de tu carpeta por los de
este zip (conserva tu `.env.local` y la carpeta `.git`) y luego:

```bash
git add -A
git commit -m "Esqueleto: 7 páginas, diseño limpio, español e inglés"
git push
```

Vercel publica solo en uno o dos minutos.

## 3. Cargar todo en Storyblok

Con tu `.env.local` lleno (ver `.env.example`), corre:

```bash
npm run seed
```

El script:

1. Activa el inglés en el espacio (traducción por campo).
2. Crea o actualiza los 13 bloques del sitio, con nombres en español.
3. Sube las fotos a la biblioteca de Storyblok.
4. Crea o reemplaza las 7 páginas y la historia "Configuración del sitio", y las publica.

Si avisa que no pudo activar el inglés, hazlo a mano en **Settings → Internationalization →
Add language**, con el código `en`, y vuelve a correr el script.

Ojo: el script **reemplaza** el contenido de esas páginas con el del demo. Úsalo para
arrancar, no después de que el cliente haya editado contenido.

En Vercel deben estar `STORYBLOK_PREVIEW_TOKEN`, `STORYBLOK_REGION` y `STORYBLOK_VERSION=draft`.

## 4. Cómo se edita

- **Una página:** Content → la página → clic en cualquier bloque del Editor Visual.
- **El inglés:** arriba del editor, cambia el idioma de *Default* a *English*. Cada texto
  muestra su versión en inglés; si se deja vacío, se usa el español.
- **El menú, la dirección y las redes:** historia "Configuración del sitio".
- **Una página nueva:** Content → + Create new → Story, tipo "Página", con la ruta que
  quieras (por ejemplo `eventos`). Aparece en `/es/eventos` y `/en/eventos`.

## 5. Guion para el demo

1. Abre el sitio en la laptop y en el celular. Recorre la Home y entra a cada sección del menú.
2. Cambia a EN arriba a la derecha: la misma página en inglés.
3. En Storyblok, abre Cervecería y cambia el nombre de una cerveza: se actualiza al momento.
4. Cambia el editor a English y edita un texto: solo cambia la versión en inglés.
5. En la Home, arrastra la galería arriba de las secciones: las páginas se arman con bloques.
6. Publica y enséñalo en el sitio.

## Si algo falla

- **401 o 404 al correr el seed:** revisa el personal access token, el ID del espacio y la región.
- **El editor visual queda en blanco:** la URL de vista previa debe empezar con `https://`.
  Para probar en local usa `npm run dev:https` y pon `https://localhost:3000/`.
- **No se ven los cambios:** confirma `STORYBLOK_VERSION=draft` en Vercel y que redeployaste.
- **El inglés no cambia:** revisa que el idioma `en` esté en Settings → Internationalization.
- **Todo falla:** quita el token en Vercel y redeploya; el sitio vuelve al modo demo.

## Estructura

```
proxy.js                       Manda "/" y rutas sin idioma a /es o /en
app/[lang]/layout.jsx          Menú y pie de página, por idioma
app/[lang]/[[...slug]]/page.jsx Busca la página en Storyblok
lib/i18n.js                    Idiomas y textos fijos de la interfaz
lib/contenido.js               Carga páginas y configuración (Storyblok o demo)
lib/storyblok.js               Conexión y bloques registrados
lib/utilidades.js              Fotos y enlaces
components/                    Un archivo por bloque
storyblok/components.json      Definición de los bloques
storyblok/paginas/             Contenido del demo, en español e inglés
scripts/seed-storyblok.mjs     Carga inicial en Storyblok
```

### Agregar un bloque nuevo

1. Agrégalo a `storyblok/components.json` (y a la lista `SECCIONES` del bloque `page`
   si va directo en una página) y corre `npm run seed`, o créalo a mano en Storyblok.
2. Crea su componente en `components/`, con `{...storyblokEditable(blok)}` en el elemento principal.
3. Regístralo en `lib/storyblok.js` con el mismo nombre técnico.

## Pendientes antes de producción

- Archivos de Monument con licencia web en `public/fonts/`.
- Fotos originales en alta resolución (las del manual miden unos 1,000 px).
- Rutas traducidas (`/en/brewery` en vez de `/en/cerveceria`), si el cliente las quiere.
- Cervezas y eventos como tipos de contenido propios, en lugar de tarjetas.
- `STORYBLOK_VERSION=published` en producción, con un entorno de vista previa aparte.
- Conectar newsletter, reservas del hotel y cotización de Venues.
