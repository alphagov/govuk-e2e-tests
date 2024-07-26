import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Publisher", { tag: ["@app-publisher"] }, () => {
  test.use({ baseURL: publishingAppUrl("publisher") });

  test("Can log in to Publisher", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Publisher")).toBeVisible();
    await expect(page.locator("#publication-list-container")).toBeVisible();
  });

  /* This mutates server side state
  test(
    "should see that the edition has been deleted",
    { tag: ["@app-publisher", "@app-publishing-api", "@notproduction"] },
    async ({ page }) => {
      // Go to the "publisher" landing page
      await page.goto("/");

      // Add an artefact
      await page.getByRole("link", { name: "Add artefact" }).click();
      await page.getByLabel("Title").fill("Smokey Guide");
      await page.getByLabel("Slug").fill("smokey-guide");
      await page.getByLabel("Format").selectOption("Guide");
      await page.getByRole("button", { name: "Save and go to item" }).click();
      await expect(page.getByRole("heading", { name: "Smokey Guide" })).toBeVisible();

      // Delete the artefact
      await page.getByRole("tab", { name: "Admin" }).click();
      await page.getByRole("button", { name: "Delete this edition" }).click();

      // Verify the edition has been deleted
      await expect(page.getByText("Edition deleted")).toBeVisible();
    }
  );
  */
});
