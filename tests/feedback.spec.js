import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Feedback", () => {
  test(
    "Check the frontend can talk to Content Store",
    {
      tag: ["@app-feedback", "@worksonmirror"],
    },
    async ({ page }) => {
      await page.goto("/contact/govuk");
      await expect(page.getByText("Contact GOV.UK")).toBeVisible();
    }
  );

  test(
    'Check "is this page useful?" email survey',
    {
      tag: ["@app-feedback", "@notcloudfront"],
    },
    async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "No   this page is not useful" }).click();
      await expect(page.getByRole("link", { name: "Please fill in this survey" })).toBeVisible();
    }
  );
});
