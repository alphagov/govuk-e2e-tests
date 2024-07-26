import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Maslow", { tag: ["@app-maslowr"] }, () => {
  test.use({ baseURL: publishingAppUrl("maslow") });

  test("Can log in to Maslow", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Maslow")).toBeVisible();
    await expect(page.getByText("All needs")).toBeVisible();
  });
});
