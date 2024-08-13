import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("CDN", { tag: ["@domain-www"] }, () => {
  test("all A/B test variants appear", { tag: ["@notcloudfront"] }, async ({ page }) => {
    await page.goto("/help/ab-testing");
    await page.getByRole("button", { name: "Accept additional cookies" }).click();

    const results = [];
    for (let i = 0; i < 20; i++) {
      await page.context().clearCookies({ name: "ABTest-Example" });
      await page.goto("/help/ab-testing");
      const variant = page.locator(".ab-example-group");
      await expect(variant).toHaveText(/(A|B)/, { useInnerText: true });
      results.push(await variant.innerText());
    }

    expect(results).toContain("A");
    expect(results).toContain("B");
  });

  test("assigned A/B test variant persists with additional cookies", { tag: ["@notcloudfront"] }, async ({ page }) => {
    await page.goto("/help/ab-testing");
    await page.getByRole("button", { name: "Accept additional cookies" }).click();
    const variant = page.locator(".ab-example-group");
    await expect(variant).toHaveText(/(A|B)/, { useInnerText: true });
    const assignedVariant = await variant.innerText();

    const results = [];
    for (let i = 0; i < 10; i++) {
      await page.goto("/help/ab-testing");
      const variant = page.locator(".ab-example-group");
      await expect(variant).toHaveText(/(A|B)/, { useInnerText: true });
      results.push(await variant.innerText());
    }

    expect(new Set(results)).toEqual(new Set(assignedVariant));
  });

  test("POST requests are not cached", { tag: ["@notcloudfront"] }, async ({ page }) => {
    await page.request.post("/find-local-council", {
      form: { postcode: "E1 8QS" },
      maxRedirects: 0,
    });

    const response = await page.request.post("/find-local-council", {
      form: { postcode: "E1 8QS" },
      maxRedirects: 0,
    });
    expect(response.headers()["x-cache-hits"]).toBe("0");
    expect(response.status()).toBe(302);
  });

  test("GET requests are cached", { tag: ["@notcloudfront"] }, async ({ page }) => {
    await page.request.get("/");
    const response = await page.request.get("/");
    expect(parseInt(response.headers()["x-cache-hits"])).toBeGreaterThan(0);
  });

  test("https upgrade for apex domain", { tag: ["@production"] }, async ({ page }) => {
    const response = await page.request.get("http://gov.uk", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()["location"]).toBe("https://gov.uk/");
  });

  test("redirect apex domain to www domain", { tag: ["@production"] }, async ({ page }) => {
    const response = await page.request.get("https://gov.uk", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()["location"]).toBe("https://www.gov.uk/");
    expect(response.headers()["strict-transport-security"]).toBe("max-age=63072000; preload");
  });

  test("https upgrade for www domain", { tag: ["@production"] }, async ({ page }) => {
    const response = await page.request.get("http://www.gov.uk", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()["location"]).toBe("https://www.gov.uk/");
  });

  test("redirect service domain to www domain", { tag: ["@production"] }, async ({ page }) => {
    const response = await page.request.get("https://service.gov.uk", { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers()["location"]).toBe("https://www.gov.uk");
    expect(response.headers()["strict-transport-security"]).toBe("max-age=63072000; includeSubDomains; preload");
  });

  test("HSTS header for www domain", async ({ page }) => {
    const response = await page.request.get("/", { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["strict-transport-security"]).toBe("max-age=31536000; preload");
  });
});
