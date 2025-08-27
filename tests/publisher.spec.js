import crypto from "crypto";
import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Publisher", { tag: ["@app-publisher"] }, () => {
  test.use({ baseURL: publishingAppUrl("publisher") });

  test("Can log in to Publisher", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Publications" })).toBeVisible();
    await expect(page.locator("#publication-list-container")).toBeVisible();
  });

  test(
    "Can add and delete an artefact in publisher",
    { tag: ["@app-publisher", "@app-publishing-api", "@not-production"] },
    async ({ page }) => {
      // Go to the "publisher" landing page
      await page.goto("/");

      // Add an artefact
      const title = `Smokey Guide ${crypto.randomUUID()}`;
      await page.getByRole("link", { name: "Add artefact" }).click();
      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Slug").fill(title.toLowerCase().replaceAll(" ", "-"));
      await page.getByLabel("Format").selectOption("Guide");
      await page.getByRole("button", { name: "Save and go to item" }).click();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();

      // Delete the artefact
      await page.getByRole("tab", { name: "Admin" }).click();
      await page.getByRole("button", { name: "Delete this edition" }).click();

      // Verify the edition has been deleted
      await expect(page.getByText("Edition deleted")).toBeVisible();
    }
  );
});
