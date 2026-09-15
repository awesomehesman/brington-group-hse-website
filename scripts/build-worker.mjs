import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { extname, relative, join } from "node:path";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
const assets = {};
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await collect(path);
    else
      assets["/" + relative("dist/client", path).split("\\").join("/")] = {
        type: types[extname(path)] || "application/octet-stream",
        data: (await readFile(path)).toString("base64"),
      };
  }
}
await collect("dist/client");
const handler = `
export function serve(request) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  const asset = assets[path];
  const headers = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'" };
  if (!asset) return new Response(request.method === 'HEAD' ? null : 'Page not found. Return to the Brington Group homepage.', { status: 404, headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' } });
  headers['Content-Type'] = asset.type;
  headers['Cache-Control'] = path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : asset.type.startsWith('text/html') ? 'no-cache' : 'public, max-age=86400';
  if (request.method === 'HEAD') return new Response(null, { headers });
  let body = Uint8Array.from(atob(asset.data), c => c.charCodeAt(0));
  if (asset.type.startsWith('text/html')) {
    body = new TextDecoder().decode(body);
    if (path === '/index.html') {
      const origin = url.origin.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
      body = body.replace('<!--SITE_METADATA-->', '<link rel="canonical" href="' + origin + '/"><meta property="og:url" content="' + origin + '/"><meta property="og:image" content="' + origin + '/og.png"><meta name="twitter:image" content="' + origin + '/og.png">');
    }
  }
  return new Response(body, { headers });
}
export default { fetch: serve };
`;
await mkdir("dist/server", { recursive: true });
await writeFile(
  "dist/server/index.js",
  `const assets = ${JSON.stringify(assets)};\n${handler}`,
);
console.log(`Packaged ${Object.keys(assets).length} static assets for Sites.`);
