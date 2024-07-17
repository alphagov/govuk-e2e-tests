import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Signon", () => {
  test.use({ baseURL: publishingAppUrl("signon") });

  test("Can log in to Signon", { tag: ["@app-signon"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Your applications")).toBeVisible();
  });
});
