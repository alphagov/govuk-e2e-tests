import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Feedback", { tag: ["@app-feedback"] }, () => {
  test("Check the frontend can talk to Content Store", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/contact/govuk");
    await expect(page.getByText("Contact GOV.UK")).toBeVisible();
  });

  test('Check "is this page useful?" email survey', { tag: ["@notcloudfront"] }, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "No   this page is not useful" }).click();
    await expect(page.getByRole("link", { name: "Please fill in this survey" })).toBeVisible();
  });

  test("ensure the header renders correctly", async ({ page }) => {
    await page.goto("/contact/govuk");
    const screenshot = await page.locator(".gem-c-layout-super-navigation-header").screenshot();
    expect(screenshot).toMatchSnapshot("expected-header.png", { maxDiffPixels: 100 });
  });
});
