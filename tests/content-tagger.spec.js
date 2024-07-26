import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Content Tagger", { tag: ["@app-content-tagger"] }, () => {
  test.use({ baseURL: publishingAppUrl("content-tagger") });

  test("Can log in to Content Tagger", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Content Tagger")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Taxons" })).toBeVisible();
  });
});
