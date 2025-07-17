import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Specialist Publisher", { tag: ["@app-specialist-publisher"] }, () => {
  test.use({ baseURL: publishingAppUrl("specialist-publisher") });

  test("Can log in to Specialist Publisher", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Specialist Publisher")).toBeVisible();
    await expect(page.getByText("All finders")).toBeVisible();
  });
});
