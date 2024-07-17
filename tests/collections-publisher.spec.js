import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Collections Publisher", () => {
  test.use({ baseURL: publishingAppUrl("collections-publisher") });

  test(
    "Can log in to collections-publisher",
    { tag: ["@app-collections-publisher", "@app-publishing-api"] },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Collections Publisher")).toBeVisible();
      await expect(page.getByText("Create new step by step")).toBeVisible();
    }
  );
});
