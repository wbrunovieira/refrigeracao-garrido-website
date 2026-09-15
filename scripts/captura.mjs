/**
 * Captura de tela via CDP, sem dependências. Precisa do chrome-headless-shell na porta 9222:
 *   "$CH" --headless --remote-debugging-port=9222 --no-sandbox --hide-scrollbars about:blank &
 *
 * Uso: node scripts/captura.mjs <url> <saida.png> '{"width":1440,"height":900,"mobile":false,
 *   "dpr":1,"espera":1200,"js":"...","jsEspera":1200,"scroll":0,"pausa":900,"eval":"..."}'
 */
const [, , url, out, opts = "{}"] = process.argv;
const o = JSON.parse(opts);
const PORT = o.port ?? 9222;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const alvos = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
let alvo = alvos.find((t) => t.type === "page");
if (!alvo) alvo = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let n = 0;
const pend = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pend.has(d.id)) {
    pend.get(d.id)(d);
    pend.delete(d.id);
  }
};
const cmd = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = ++n;
    pend.set(id, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });

await cmd("Emulation.setDeviceMetricsOverride", {
  width: o.width ?? 1440, height: o.height ?? 900,
  deviceScaleFactor: o.dpr ?? 1, mobile: !!o.mobile,
});
await cmd("Page.navigate", { url });
await espera(o.espera ?? 1200);
if (o.js) { await cmd("Runtime.evaluate", { expression: o.js, awaitPromise: true }); await espera(o.jsEspera ?? 1200); }
if (o.scroll != null) await cmd("Runtime.evaluate", { expression: `window.scrollTo({top:${o.scroll},behavior:'instant'})` });
await espera(o.pausa ?? 900);
if (o.eval) {
  const { result } = await cmd("Runtime.evaluate", { expression: o.eval, returnByValue: true });
  console.log("EVAL", JSON.stringify(result?.value));
}
const { data } = await cmd("Page.captureScreenshot", { format: "png" });
const { writeFileSync } = await import("node:fs");
writeFileSync(out, Buffer.from(data, "base64"));
ws.close();
console.log("ok", out);
