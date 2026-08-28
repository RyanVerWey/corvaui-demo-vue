import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const routes = [
  ["home", "/#/", "Pacific network"],
  ["compare", "/#/about", "Live milestones"],
  ["shipments", "/#/data-table", "NA-82041"],
  ["reports", "/#/dashboard", "Transpacific eastbound"],
] as const;

for (const [name, path, expectedContent] of routes) {
  test(`${name} route is responsive and WCAG AA clean`, async ({ page }, testInfo) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" || /hydration/i.test(message.text())) runtimeErrors.push(message.text());
    });
    await page.goto(path, { waitUntil: "networkidle" });
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(viewportWidth).toBe(testInfo.project.name === "mobile" ? 412 : 1440);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(expectedContent, { exact: false }).first()).toBeVisible();
    const overflow = await page.evaluate(() => ({
      amount: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      elements: [...document.querySelectorAll("*")].filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 8).map((element) => `${element.tagName.toLowerCase()}.${element.className}`),
    }));
    expect(overflow.amount, overflow.elements.join("\n")).toBeLessThanOrEqual(1);
    expect(runtimeErrors).toEqual([]);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => (await (window as typeof window & { axe: { run: (root: Document, options: unknown) => Promise<{ violations: unknown[] }> } }).axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
    expect(violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
  });
}

test("theme control applies an accessible Ocean dark mode", async ({ page }, testInfo) => {
  await page.goto("/#/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Dark" }).click();
  await expect(page.locator(".site-shell")).toHaveAttribute("data-corva-theme", "ocean-dark");
  await page.waitForTimeout(250);
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => (await (window as typeof window & { axe: { run: (root: Document, options: unknown) => Promise<{ violations: unknown[] }> } }).axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
  expect(violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("ocean-dark.png"), fullPage: true });
});
