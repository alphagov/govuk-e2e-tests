import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Places Manager", { tag: ["@app-places-manager"] }, () => {
  test.use({ baseURL: publishingAppUrl("places-manager") });

  test("Can log in to Places Manager", { tag: ["@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Places Manager")).toBeVisible();
    await expect(page.getByText("All services")).toBeVisible();
  });
});
