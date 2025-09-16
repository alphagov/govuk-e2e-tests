import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("GOV.UK Chat", { tag: ["@app-govuk-chat", "@not-integration"] }, () => {
  test.use({ baseURL: publishingAppUrl("chat") });

  test("Can view a static page", async ({ page }) => {
    await page.goto("/chat/about");
    await expect(page.getByRole("heading", { name: "About GOV.UK Chat" })).toBeVisible();
  });
});

test.describe("GOV.UK Chat Admin", { tag: ["@app-govuk-chat", "@not-integration"] }, () => {
  test.use({ baseURL: publishingAppUrl("chat") });

  test("Can log in to chat admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "GOV.UK Chat Admin" })).toBeVisible();
  });
});
