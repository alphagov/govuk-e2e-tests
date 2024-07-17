import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Content Data", () => {
  test.use({ baseURL: publishingAppUrl("content-data") });

  test("Can log in to Content Data", { tag: ["@app-content-data-admin"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Content Data")).toBeVisible();
  });

  test("Check admin can talk to Content Data API", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search for a title or URL").fill("Government Digital Service");
    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByRole("link", { name: "Government Digital Service", exact: true }).click();
    await expect(page.getByText("Page data")).toBeVisible();
    const pageViews = await page
      .locator("div.app-c-glance-metric")
      .filter({ hasText: "Unique page views" })
      .locator(".app-c-glance-metric__figure")
      .innerText();
    await expect(parseInt(pageViews)).toBeGreaterThan(0);
  });
});
