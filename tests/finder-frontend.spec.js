import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Finder frontend", { tag: ["@app-finder-frontend"] }, () => {
  test("Can search for ministers and senior officials", async ({ page }) => {
    await page.goto("/government/people");
    await expect(page.getByRole("heading", { name: "All ministers and senior officials on GOV.UK" })).toBeVisible();
    const searchBox = page.getByRole("search");
    await searchBox.getByRole("searchbox", { name: "Search" }).fill("Churchill");
    await searchBox.getByRole("button", { name: "Search" }).click();
    await expect(page.getByRole("link", { name: "Sir Winston Churchill" })).toBeVisible();
  });

  test("Check the frontend can talk to Email Alert API", async ({ page }) => {
    await page.goto("/search/research-and-statistics");
    await page.getByRole("link", { name: "Get emails" }).first().click();
    await page.getByText("Statistics (published)").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("How often do you want to get emails?")).toBeVisible();
  });

  test("check application CSS loads", async ({ page, request }) => {
    await page.goto("/search/research-and-statistics");
    const applicationCSSPath = await page
      .locator('link[rel="stylesheet"][href*="/assets/finder-frontend/application-"]')
      .getAttribute("href");
    const response = await request.get(`${applicationCSSPath}`);
    expect(response.status()).toBe(200);
  });

  test("Can use site search and receive results", async ({ page }) => {
    await page.goto("/");
    const searchBox = page.getByRole("search");
    await searchBox.getByLabel("Search").fill("Universal Credit");
    await searchBox.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveTitle("Universal Credit - Search - GOV.UK");
    await expect(page.getByRole("link", { name: "Universal Credit" }).first()).toBeVisible();
  });
});
