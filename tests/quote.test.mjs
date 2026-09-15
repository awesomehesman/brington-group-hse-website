import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { prepareEnquiry, setupQuoteForm, validateEnquiry } from "../quote.js";
import { renderPage } from "../scripts/render-page.mjs";
import { SERVICES } from "../site-content.js";
const valid = {
  name: "Test Person",
  company: "A & B <Engineering>",
  phone: "+27 78 123 4567",
  email: "person@example.com",
  service: SERVICES[0].title,
  location: "Johannesburg",
  message: "Safety file for a small construction project.\nStart: next month.",
};
const template = await readFile(
  new URL("../index.html", import.meta.url),
  "utf8",
);
function fixture() {
  const dom = new JSDOM(renderPage(template));
  const form = dom.window.document.querySelector("#contact-form");
  return { dom, form };
}
function fill(form, data = valid) {
  for (const [key, value] of Object.entries(data))
    form.elements.namedItem(key).value = value;
}
function send(dom, form) {
  form.dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true }),
  );
}
test("enquiry encodes the confirmed WhatsApp recipient, every field and special characters", () => {
  const prepared = prepareEnquiry(valid);
  const url = new URL(prepared.whatsappUrl);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/27780938562");
  assert.equal(url.searchParams.get("text"), prepared.message);
  for (const value of Object.values(valid))
    assert.ok(prepared.message.includes(value));
  assert.equal(new URL(prepared.emailUrl).pathname, "nkomo07@gmail.com");
  assert.ok(decodeURIComponent(prepared.emailUrl).includes(valid.message));
});
test("validation rejects blank content, unknown service, malformed email and phone", () => {
  assert.deepEqual(
    Object.keys(
      validateEnquiry({
        name: " ",
        phone: "hello12345678",
        email: "invalid",
        service: "fake",
        message: " ",
      }),
    ),
    ["name", "phone", "email", "service", "message"],
  );
  assert.deepEqual(validateEnquiry(valid), {});
});
test("invalid form focuses the first error and does not prepare a draft", () => {
  const { dom, form } = fixture();
  let calls = 0;
  setupQuoteForm(form, () => {
    calls++;
  });
  send(dom, form);
  assert.equal(dom.window.document.activeElement.id, "full-name");
  assert.equal(form.elements.name.getAttribute("aria-invalid"), "true");
  assert.equal(calls, 0);
  assert.equal(form.querySelector(".quote-result").hidden, true);
});
test("form previews text safely, preserves data, never claims delivery and invalidates stale drafts", () => {
  const { dom, form } = fixture();
  setupQuoteForm(form);
  fill(form);
  send(dom, form);
  assert.equal(form.querySelector(".quote-result").hidden, false);
  assert.match(
    form.querySelector(".form-status").textContent,
    /nothing has been sent/,
  );
  assert.equal(form.elements.name.value, valid.name);
  assert.equal(form.querySelector(".quote-preview").children.length, 0);
  assert.equal(dom.window.document.activeElement.id, "review-title");
  form.elements.message.value = "Changed";
  form.elements.message.dispatchEvent(
    new dom.window.Event("input", { bubbles: true }),
  );
  assert.equal(form.querySelector(".quote-result").hidden, true);
});
test("adapter failure retains entries and gives direct-contact recovery", () => {
  const { dom, form } = fixture();
  setupQuoteForm(form, () => {
    throw new Error("Failed");
  });
  fill(form);
  send(dom, form);
  assert.match(
    form.querySelector(".form-status").textContent,
    /call, email or WhatsApp/,
  );
  assert.equal(form.elements.name.value, valid.name);
});
test("rendered page has working contacts and complete services without JavaScript", () => {
  const doc = new JSDOM(renderPage(template, "https://example.com")).window
    .document;
  assert.equal(doc.querySelectorAll(".service-card").length, 7);
  assert.equal(doc.querySelectorAll("#service option").length, 9);
  assert.ok(doc.querySelector('a[href="tel:+27780938562"]'));
  assert.ok(doc.querySelector('a[href="mailto:nkomo07@gmail.com"]'));
  assert.equal(
    doc.querySelector('[property="og:image"]').content,
    "https://example.com/og.png",
  );
  assert.equal(doc.querySelectorAll(".pillar").length, 4);
});
