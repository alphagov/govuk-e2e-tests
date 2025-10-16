import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Government Frontend", { tag: ["@app-government-frontend"] }, () => {
  test("Check the frontend can talk to Content Store", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/organisations/british-embassy-madrid");
    await expect(page.getByRole("heading", { name: "British Embassy Madrid", level: 1 })).toBeVisible();
    await expect(
      page.getByText("The British Embassy in Madrid maintains and develops relations between the UK and Spain.")
    ).toBeVisible();
  });

  test("check application CSS loads", async ({ page, request }) => {
    await page.goto("/world/organisations/british-embassy-madrid");
    const applicationCSSPath = await page
      .locator('link[rel="stylesheet"][href*="/assets/government-frontend/application-"]')
      .getAttribute("href");
    const response = await request.get(`${applicationCSSPath}`);
    expect(response.status()).toBe(200);
  });
});
