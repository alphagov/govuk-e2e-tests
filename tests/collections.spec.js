import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Collections", { tag: ["@app-collections"] }, () => {
  test("Check the frontend can talk to Content Store", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/browse/driving");
    await expect(page.locator("body")).toContainText("Teaching people to drive");
    await page.getByRole("link", { name: "Teaching people to drive" }).click();
    await expect(page.locator("body")).toContainText("Apply to become a driving instructor");
  });

  test("Check the frontend can talk to Search API", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/afghanistan/news");
    const latestSection = page.locator("#latest");
    await expect(latestSection.getByRole("heading", { name: "Latest" })).toBeVisible();
    await expect(latestSection.locator(".gem-c-document-list__item-metadata")).toHaveCount(3);
  });

  test.describe("Email Alert Frontend", () => {
    test("Check the frontend can talk to Email Alert API", { tag: ["@app-email-alert-frontend"] }, async ({ page }) => {
      await page.goto("/education");
      await page.getByRole("link", { name: "Get emails for this topic" }).click();
      await expect(page.getByRole("heading", { name: "What do you want to get emails about?" })).toBeVisible();
      await page.getByText("Teaching and leadership").check();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByText("Teaching and leadership")).toBeVisible();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByRole("heading", { name: "How often do you want to get emails?" })).toBeVisible();
      await page.getByText("Once a week").check();
      await page.getByRole("button", { name: "Continue" }).click();
      await page.getByLabel("Enter your email address").fill("example@example.com");
    });
  });
});
