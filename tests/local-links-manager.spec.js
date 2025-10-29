import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Local Links Manager", { tag: ["@app-local-links-manager"] }, () => {
  test.use({ baseURL: publishingAppUrl("local-links-manager") });

  test(
    "Can log in to Local Links Manager",
    { tag: ["@app-publishing-api", "@publishing-app", "@not-staging"] },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Local Links Manager")).toBeVisible();
      await expect(page.getByText("Councils")).toBeVisible();
    }
  );
});
