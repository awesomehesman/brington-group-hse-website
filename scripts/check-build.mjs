import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const root = new URL("../dist/client/", import.meta.url);
for (const page of ["index.html", "privacy.html", "image-credits.html"]) {
  const html = await readFile(new URL(page, root), "utf8");
  assert.doesNotMatch(html, /__[A-Z_]+__/, `Unresolved template in ${page}`);
  const doc = new JSDOM(html).window.document;
  assert.equal(doc.querySelectorAll("h1").length, 1);
  const ids = [...doc.querySelectorAll("[id]")].map((element) => element.id);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${page}`);
  for (const element of doc.querySelectorAll("[src], [href]")) {
    const path = element.getAttribute("src") || element.getAttribute("href");
    if (!path || /^(?:https?:|mailto:|tel:|#)/.test(path)) continue;
    const pathname = path.split("#")[0] || "/";
    await access(
      new URL(
        pathname === "/" ? "index.html" : pathname.replace(/^\//, ""),
        root,
      ),
    );
  }
  for (const link of doc.querySelectorAll('a[href^="#"]'))
    assert.ok(doc.getElementById(link.hash.slice(1)), `Missing ${link.hash}`);
  if (page === "index.html") {
    assert.equal(doc.querySelectorAll(".service-card").length, 7);
    assert.ok(doc.querySelector('script[type="module"]'));
    assert.equal(
      JSON.parse(
        doc.querySelector('script[type="application/ld+json"]').textContent,
      ).email,
      "lnkomo07@gmail.com",
    );
  }
}
console.log(
  "Build verified: pages, asset paths, anchors, services and structured metadata.",
);
