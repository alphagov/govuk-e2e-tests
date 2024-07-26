import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Government Frontend", { tag: ["@app-government-frontend"] }, () => {
  test("Check the frontend can talk to Content Store", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/get-involved");
    await expect(page.getByRole("heading", { name: "Get involved" })).toBeVisible();
    await expect(
      page.getByText(
        "Find out how you can engage with government directly, and take part locally, nationally or internationally."
      )
    ).toBeVisible();
  });

  test("Check the frontend can talk to Email Alert API", { tag: ["@app-email-alert-frontend"] }, async ({ page }) => {
    await page.goto("/foreign-travel-advice/turkey");
    await page.getByRole("link", { name: "Get email alerts" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("How often do you want to get emails?")).toBeVisible();
  });

  test("Check the frontend can talk to Search API", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/get-involved");
    await expect(page.getByRole("heading", { name: "Recently opened" })).toBeVisible();
    await expect(page.locator(".get-involved > div").nth(3).locator(".gem-c-document-list__item-title")).toHaveCount(3);
  });

  test("Check a travel advice country page loads", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/foreign-travel-advice/luxembourg");
    await expect(page.getByRole("heading", { name: "Luxembourg" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Warnings and insurance" })).toBeVisible();
  });

  test("Check that Service Manuals load", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/service-manual");
    await expect(page.getByRole("heading", { name: "Service Manual" })).toBeVisible();
  });
});
