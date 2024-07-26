import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import crypto from "crypto";
import { logIntoSignon, publishingAppUrl } from "../lib/utils";

test.describe("Origin", () => {
  test("Check that the WAF is working", { tag: ["@local-network"] }, async ({ request }) => {
    const cacheBust = crypto.randomBytes(16).toString("hex");
    const response = await request.get("/robots.txt", {
      headers: {
        "X-Always-Block": "true",
      },
      params: {
        cacheBust: cacheBust,
      },
    });
    expect(response.status()).toBe(403);
  });

  test("Check robots.txt loads", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/robots.txt");
    await expect(page.getByText("User-agent:")).toBeVisible();
  });

  test("Check redirects work", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/workplacepensions");
    await expect(page).toHaveURL("/workplace-pensions");
  });

  test("Check 404 page loads", async ({ page }) => {
    await page.goto("/non-existent-page");
    await expect(page.getByText("Page not found")).toBeVisible();
  });

  test("Check pages are rendered using UTF-8", { tag: ["@worksonmirror"] }, async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["content-type"]).toBe("text/html; charset=utf-8");
  });
});

test.describe("Draft origin", () => {
  test.use({ storageState: { cookies: [], origins: [] }, baseURL: publishingAppUrl("draft-origin") });

  test(
    "Check visiting a draft page requires a signon session",
    { tag: ["@app-authenticating-proxy"] },
    async ({ page }) => {
      await page.goto("government/case-studies/primary-authority-helps-acorn-safeguard-its-business-reputation");
      await logIntoSignon(page);
      await expect(page.getByText("Case study")).toBeVisible();
      await expect(page.locator("body")).toHaveClass(/draft/);
    }
  );
});
