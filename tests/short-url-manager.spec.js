import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Short URL Manager", { tag: ["@app-short-url-manager"] }, () => {
  test.use({ baseURL: publishingAppUrl("short-url-manager") });

  test("Can log in to Short URL Manager", { tag: ["@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Short URL manager")).toBeVisible();
    await expect(page.getByRole("link", { name: "Request a new" })).toBeVisible();
  });
});
