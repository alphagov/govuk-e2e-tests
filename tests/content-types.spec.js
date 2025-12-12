import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Content-Types", { tag: ["@domain-www", "@worksonmirror"] }, () => {
  test("html content-type is correct", {}, async ({ page }) => {
    const response = await page.goto("/");

    const headers = response.headers();

    expect(headers["content-type"]).toContain("text/html");
  });

  test("javascript content-type is correct", {}, async ({ page }) => {
    await page.goto("/");

    const script = await page.locator("script").first();

    const scriptSrc = await script.getAttribute("src");

    expect(script).toHaveAttribute("src", /^\/assets\//);

    const response = await page.goto(scriptSrc);

    const headers = response.headers();

    expect(headers["content-type"]).toContain("text/javascript");
  });

  test("css content-type is correct", {}, async ({ page }) => {
    await page.goto("/");

    const css = await page.locator("link[rel='stylesheet']").first();

    const cssHref = await css.getAttribute("href");

    expect(css).toHaveAttribute("href", /^\/assets\//);

    const response = await page.goto(cssHref);

    const headers = response.headers();

    expect(headers["content-type"]).toContain("text/css");
  });
});
