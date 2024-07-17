import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Finder frontend", () => {
  test(
    "Can search for ministers and senior officials",
    {
      tag: ["@app-finder-frontend"],
    },
    async ({ page }) => {
      await page.goto("/government/people");
      await expect(page.getByRole("heading", { name: "All ministers and senior officials on GOV.UK" })).toBeVisible();
      const searchBox = page.getByRole("search");
      await searchBox.getByRole("searchbox", { name: "Search" }).fill("Churchill");
      await searchBox.getByRole("button", { name: "Search" }).click();
      await expect(page.getByRole("link", { name: "Sir Winston Churchill" })).toBeVisible();
    }
  );

  test(
    "Check the frontend can talk to Email Alert API",
    {
      tag: ["@app-finder-frontend", "@app-email-alert-frontend"],
    },
    async ({ page }) => {
      await page.goto("/search/research-and-statistics");
      await page.getByRole("link", { name: "Get emails" }).first().click();
      await page.getByText("Statistics (published)").check();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByText("How often do you want to get emails?")).toBeVisible();
    }
  );

  test(
    "Check the frontend can talk to Search API",
    {
      tag: ["@app-finder-frontend", "@notcloudfront"],
    },
    async ({ page }) => {
      await page.goto("/");
      const searchBox = page.getByRole("search");
      await searchBox.getByRole("searchbox", { name: "Search" }).fill("Universal Credit");
      await searchBox.getByRole("button", { name: "Search" }).click();
      await expect(page.getByRole("region", { name: "Search search results" })).toBeVisible();
    }
  );
});
