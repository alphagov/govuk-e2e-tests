import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Service Manual Publisher", () => {
  test.use({ baseURL: publishingAppUrl("service-manual-publisher") });

  test(
    "Can log in to Service Manual Publisher",
    { tag: ["@app-service-manual-publisher", "@app-publishing-api"] },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Service Manual Publisher")).toBeVisible();
      await expect(page.getByRole("link", { name: "Create a Guide", exact: true })).toBeVisible();
    }
  );
});
