import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Local Links Manager", () => {
  test.use({ baseURL: publishingAppUrl("local-links-manager") });

  test(
    "Can log in to Local Links Manager",
    { tag: ["@app-local-links-manager", "@app-publishing-api"] },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Local Links Manager")).toBeVisible();
      await expect(page.getByText("Councils")).toBeVisible();
    }
  );
});
