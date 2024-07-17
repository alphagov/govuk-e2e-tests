import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Whitehall", () => {
  test.use({ baseURL: publishingAppUrl("whitehall-admin") });

  test("Can log in to Whitehall", { tag: ["@app-whitehall", "@app-publishing-api"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("GOV.UK Whitehall")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("My draft documents")).toBeVisible();
  });
});
