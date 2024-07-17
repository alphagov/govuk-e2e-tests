import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Travel Advice Publisher", () => {
  test.use({ baseURL: publishingAppUrl("travel-advice-publisher") });

  test(
    "Can log in to Travel Advice Publisher",
    { tag: ["@app-travel-advice-publisher", "@app-publishing-api"] },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Travel Advice Publisher")).toBeVisible();
      await expect(page.getByText("All countries")).toBeVisible();
    }
  );
});
