# Brington Group HSE Consultants

A responsive static website for a Johannesburg HSE consultancy serving South Africa. This project keeps the existing HTML, CSS and JavaScript design and follows the flat Vite structure used by `PAINTERS-PAINTS`, as requested. It does not implement the Angular architecture from the original brief.

## Local development

Prerequisites: Node.js 20.19+ in the 20.x series, or Node.js 22.12+; npm.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Use `npm ci` for repeatable installation after the lockfile is committed. The development server binds to localhost. No lint command is configured.

## Project structure

```text
assets/
  source/Logo Design.png       Original supplied branding reference
public/
  images/brington-branding.png Public copy used by the current page
scripts/
  check-build.mjs              Checks built HTML asset references
tests/                       Enquiry behavior tests (Node + jsdom)
docs/
  BRAND-GUIDE.md
business-config.js            Central company/contact configuration
quote.js                      Enquiry adapter and form behavior
index.html                    Existing single-page content
script.js                     Navigation, reveals and business configuration
styles.css                    Existing responsive design
package.json
package-lock.json
vite.config.js
vercel.json
dist/client/                  Generated production website (gitignored)
node_modules/                 Installed dependencies (gitignored)
```

Like PAINTERS-PAINTS, page files and browser modules live at the root; source assets, public assets, scripts and tests have their own folders. The existing original image is now under `assets/source`. Keep its public copy in sync if replacing the current branding. Gallery modules and Sites hosting files are specific to PAINTERS-PAINTS and are not needed here.

## Business and contact configuration

Edit `business-config.js`. Phone, email and WhatsApp are intentionally empty until confirmed by the owner. The footer reads the location and email from this configuration and calculates the copyright year automatically. Phone and WhatsApp are reserved for future contact links; the current page does not expose those channels.

## Enquiries and future backend integration

`quote.js` separates the form from the delivery adapter. There is no backend, and no enquiry is currently sent or stored. The form reports this explicitly and retains entered text. Replace `submitEnquiry` with a real API request returning `{ sent, message }`, marking `sent` true only after confirmed delivery. Before enabling collection, supply the endpoint, server-side validation, abuse protection and appropriate privacy information.

## Deployment

`npm run build` emits the static website into `dist/client` and checks local asset references. `vercel.json` configures the same output with `npm run build:vercel`. Other static hosts can publish `dist/client`. There are no server routes; navigation uses page anchors. Deployment has not been performed.

Google Fonts and the existing Unsplash image URLs require internet access. No production domain or social sharing image is assumed. The original supplied branding image is retained as currently used; an approved emblem-only asset remains needed.

## Validation and scope

`npm test` covers unsent enquiries, invalid email and submission failure. Build verification checks emitted page assets. These are not visual or physical-device tests.

This change organizes and adds tooling to the existing website. The original brief remains a broader backlog: full seven-service content, complete quote fields, WhatsApp integration, approved emblem, and a complete accessibility/responsive/SEO review are still outstanding. Confirm phone, WhatsApp, email, any public street address, certifications, social profiles and privacy details before adding them.
