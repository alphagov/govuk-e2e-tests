import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Whitehall", { tag: ["@app-whitehall"] }, () => {
  test.use({ baseURL: publishingAppUrl("whitehall-admin") });

  test("Can log in to Whitehall", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("GOV.UK Whitehall")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("My draft documents")).toBeVisible();
  });

  test(
    "Can update an edition and preview it on the frontend",
    { tag: ["@publishing-app", "@app-publishing-api"] },
    async ({ page }) => {
      // path to an old, unused, test document we can freely edit in draft mode
      const testDocumentPath = "/government/admin/publications/572828";
      // the value we're going to check makes it through to the frontend
      const lastUpdatedMessage = `Updated: ${new Date().toISOString()}`;

      // Update the draft
      await page.goto(testDocumentPath);
      await page.getByRole("button", { name: "Edit draft" }).click();
      await page.getByLabel("Body (required)").fill(lastUpdatedMessage);
      await page.getByRole("button", { name: "Save and go to document summary" }).click();
      await expect(page.getByText("Your document has been saved")).toBeVisible();

      // Verify the draft has been updated, allowing some retries because
      // propagating through to the frontend can take a little time
      const previewLink = await page.locator("text=Preview on website (opens in new tab)").getAttribute("href");
      const maxRetries = 10;
      for (let retries = 0; retries < maxRetries; retries++) {
        await page.goto(previewLink + "?cachebust=" + Date.now());
        try {
          await expect(page.getByText(lastUpdatedMessage)).toBeVisible({ timeout: 1000 });
          break; // Exit loop if found
        } catch {
          console.log(`Retry ${retries + 1}/${maxRetries}: Update not found, retrying...`);
          if (retries === maxRetries - 1) {
            // eslint-disable-line playwright/no-conditional-in-test
            throw new Error(`Updated message did not appear in preview after ${maxRetries} seconds`);
          }
        }
      }
    }
  );
});
