import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Government Frontend", { tag: ["@app-government-frontend"] }, () => {
  test("Check the frontend can talk to Content Store", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/hmrc-internal-manuals/apprenticeship-levy");
    await expect(page.getByRole("heading", { name: "Apprenticeship Levy Manual", level: 1 })).toBeVisible();
    await expect(page.getByText("Guidance on the Apprenticeship Levy")).toBeVisible();
  });

  test("check application CSS loads", async ({ page, request }) => {
    await page.goto("/hmrc-internal-manuals/apprenticeship-levy");
    const applicationCSSPath = await page
      .locator('link[rel="stylesheet"][href*="/assets/government-frontend/application-"]')
      .getAttribute("href");
    const response = await request.get(`${applicationCSSPath}`);
    expect(response.status()).toBe(200);
  });
});
