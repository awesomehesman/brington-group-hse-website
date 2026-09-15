import { COMPANY_INFO } from "../business-config.js";
import { SERVICES } from "../site-content.js";
export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function renderPage(html, origin = "") {
  const safeOrigin = /^https?:\/\/[^\s]+$/.test(origin)
    ? new URL(origin).origin
    : "";
  const message =
    "Hi Brington Group, I'd like assistance with HSE services and would like to request a quote.";
  const tokens = {
    PHONE: COMPANY_INFO.phone,
    TEL: `tel:${COMPANY_INFO.phone.replace(/[^+\d]/g, "")}`,
    EMAIL: COMPANY_INFO.email,
    LOCATION: COMPANY_INFO.location,
    YEAR: new Date().getFullYear(),
    WHATSAPP: `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`,
    SERVICES: SERVICES.map(
      (service, i) =>
        `<article class="service-card" id="${service.id}"><div class="card-top"><i data-lucide="${service.icon}" aria-hidden="true"></i><span class="card-number">0${i + 1}</span></div><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p><a class="service-link" href="#quote" data-service="${escapeHtml(service.title)}" aria-label="Request a quote for ${escapeHtml(service.title)}">Enquire about this service <span aria-hidden="true">↗</span></a></article>`,
    ).join(""),
    OPTIONS:
      SERVICES.map(({ title }) => `<option>${escapeHtml(title)}</option>`).join(
        "",
      ) + "<option>Other</option>",
    FOOTER_SERVICES: SERVICES.map(
      ({ title, id }) => `<li><a href="/#${id}">${escapeHtml(title)}</a></li>`,
    ).join(""),
    ORIGIN_METADATA: safeOrigin
      ? `<link rel="canonical" href="${escapeHtml(safeOrigin)}/"><meta property="og:url" content="${escapeHtml(safeOrigin)}/"><meta property="og:image" content="${escapeHtml(safeOrigin)}/og.png"><meta name="twitter:image" content="${escapeHtml(safeOrigin)}/og.png"><meta property="og:image:width" content="1536"><meta property="og:image:height" content="1024">`
      : "<!--SITE_METADATA-->",
    STRUCTURED_DATA: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: COMPANY_INFO.name,
      telephone: COMPANY_INFO.phone,
      email: COMPANY_INFO.email,
      areaServed: COMPANY_INFO.serviceArea,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Johannesburg",
        addressRegion: "Gauteng",
        addressCountry: "ZA",
      },
      ...(safeOrigin ? { url: safeOrigin } : {}),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "HSE consulting services",
        itemListElement: SERVICES.map(({ title }) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: title },
        })),
      },
    }).replaceAll("<", "\\u003c"),
  };
  const raw = new Set([
    "SERVICES",
    "OPTIONS",
    "FOOTER_SERVICES",
    "ORIGIN_METADATA",
    "STRUCTURED_DATA",
  ]);
  return html.replace(/__([A-Z_]+)__/g, (token, key) =>
    key in tokens
      ? raw.has(key)
        ? tokens[key]
        : escapeHtml(tokens[key])
      : token,
  );
}
