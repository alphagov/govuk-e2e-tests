import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Contacts Admin", () => {
  test.use({ baseURL: publishingAppUrl("contacts-admin") });

  test("Can log in to Contacts Admin", { tag: ["@app-contacts-admin", "@app-publishing-api"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Contacts" })).toBeVisible();
    await expect(page.getByText("Add contact")).toBeVisible();
  });
});
