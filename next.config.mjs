/** @type {import('next').NextConfig} */
const nextConfig = {
  // "Tienda en línea" ahora se llama "Almacén"
  async redirects() {
    return [{ source: "/:lang(es|en)/tienda", destination: "/:lang/almacen", permanent: true }];
  },
};
export default nextConfig;
