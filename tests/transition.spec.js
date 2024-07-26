import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Transition", { tag: ["@app-transition"] }, () => {
  test.use({ baseURL: publishingAppUrl("transition") });

  test("Can log in to Transition", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Transition")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Organisations" })).toBeVisible();
  });
});
