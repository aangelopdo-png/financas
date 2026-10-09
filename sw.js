const CACHE = "financas-mv0bydaj";
const CASCA = ["./", "./index.html", "./manifest.json", "./icone-192.png", "./icone-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CASCA)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("versao.json")) return;
  // Página e arquivos do app: rede primeiro (versão nova aparece já na 1ª abertura); sem rede, usa a cópia guardada
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) caches.open(CACHE).then((c) => c.put(e.request, r.clone())); return r; })
    .catch(() => caches.match(e.request).then((hit) => hit || caches.match("./index.html"))));
});