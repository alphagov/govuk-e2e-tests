import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Manuals Publisher", () => {
  test.use({ baseURL: publishingAppUrl("manuals-publisher") });

  test(
    "Can log in to Manuals Publisher",
    { tag: ["@app-manuals-publisher", "@app-publishing-api"] },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Manuals Publisher")).toBeVisible();
      await expect(page.getByText("Create new manual")).toBeVisible();
    }
  );
});
