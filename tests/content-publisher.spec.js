import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Content Publisher", { tag: ["@app-content-publisher"] }, () => {
  test.use({ baseURL: publishingAppUrl("content-publisher") });

  test("Can log in to Content Publisher", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Content Publisher", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Documents", exact: true })).toBeVisible();
  });
});
