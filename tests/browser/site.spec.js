import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const widths = [320, 375, 430, 768, 1024, 1440, 1920];
for (const width of widths) {
  test(`layout, loading and accessibility at ${width}px`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      await expect(img).not.toHaveJSProperty("naturalWidth", 0);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator(".service-card")).toHaveCount(7);
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return (
            r.width &&
            (r.right > innerWidth + 1 || r.left < -1) &&
            !e.matches(".skip-link")
          );
        })
        .map((e) => e.tagName + "." + e.className),
    );
    expect(overflowing).toEqual([]);
    expect(errors).toEqual([]);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
    if (process.env.QA_SCREENSHOTS) {
      await mkdir(process.env.QA_SCREENSHOTS, { recursive: true });
      await page.screenshot({
        path: `${process.env.QA_SCREENSHOTS}/${width}-full.png`,
        fullPage: true,
      });
      await page.screenshot({
        path: `${process.env.QA_SCREENSHOTS}/${width}-hero.png`,
      });
    }
  });
}
test("mobile navigation supports keyboard dismissal and service selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.locator(".menu-toggle");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .locator("#site-nav")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await page.locator(".service-card").first().getByRole("link").click();
  await expect(page.locator("#service")).toHaveValue(
    "SHE Files / Safety Files",
  );
  await expect(page.locator("#full-name")).toBeFocused();
});
test("quote validation, review, encoding and stale draft protection", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Prepare my quote request" }).click();
  await expect(page.locator("#full-name")).toBeFocused();
  await expect(page.locator("#name-error")).toContainText("full name");
  await page.getByLabel("Full name").fill("Test Client");
  await page.getByLabel("Company name").fill("A & B <Engineering>");
  await page.getByLabel("Phone number").fill("+27 78 123 4567");
  await page.getByLabel("Email address").fill("client@example.com");
  await page
    .getByLabel("Service required")
    .selectOption("SHE Files / Safety Files");
  await page.getByLabel("Project location").fill("Johannesburg");
  await page
    .getByLabel("Project description")
    .fill("Safety file for a new project.");
  await page.getByRole("button", { name: "Prepare my quote request" }).click();
  await expect(page.locator("#review-title")).toBeFocused();
  await expect(page.locator(".quote-preview")).toContainText(
    "A & B <Engineering>",
  );
  const href = await page.locator("[data-send-whatsapp]").getAttribute("href");
  const url = new URL(href);
  expect(url.pathname).toBe("/27780938562");
  expect(url.searchParams.get("text")).toContain("client@example.com");
  await expect(page.locator(".form-status")).toContainText(
    "nothing has been sent",
  );
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.getByLabel("Full name").fill("Edited Client");
  await expect(page.locator(".quote-result")).toBeHidden();
});
test("no JavaScript leaves content, navigation and direct contact usable", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4178/");
  await expect(page.locator("#site-nav")).toBeVisible();
  await expect(page.locator(".service-card")).toHaveCount(7);
  await expect(
    page.locator('.contact-methods a[href="tel:+27780938562"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Prepare my quote request" }),
  ).toBeDisabled();
  await context.close();
});
test("supporting pages, metadata, reduced motion and server safety", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "http://127.0.0.1:4178/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "http://127.0.0.1:4178/og.png",
  );
  for (const route of ["/privacy.html", "/image-credits.html"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    const a = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(a.violations).toEqual([]);
  }
  expect((await request.get("/does-not-exist")).status()).toBe(404);
  expect((await request.post("/")).status()).toBe(405);
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});
