import { NextResponse } from "next/server";

const idiomas = ["es", "en"];

// Cada página vive bajo /es o /en. Si alguien entra sin idioma
// (por ejemplo a "/" o "/hotel"), lo mandamos al que corresponde:
// el último que eligió, o el de su navegador.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const actual = idiomas.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (actual) {
    const respuesta = NextResponse.next();
    if (request.cookies.get("idioma")?.value !== actual) {
      respuesta.cookies.set("idioma", actual, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
    return respuesta;
  }

  const guardado = request.cookies.get("idioma")?.value;
  const navegador = request.headers.get("accept-language")?.toLowerCase().startsWith("en") ? "en" : "es";
  const lang = idiomas.includes(guardado) ? guardado : navegador;

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Todo menos archivos internos de Next.js y archivos con extensión (fotos, logo...)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
