import crypto from "crypto";
import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Publisher", { tag: ["@app-publisher"] }, () => {
  test.use({ baseURL: publishingAppUrl("publisher") });

  test("Can log in to Publisher", { tag: ["@app-publishing-api", "@publishing-app"] }, async ({ page, context }) => {
    // TODO: Remove once Publisher changes setting these feature toggles to default: true have been deployed
    await context.addCookies([
      {
        name: "design_system_edit_phase_3b",
        value: "1",
        url: publishingAppUrl("publisher"),
      },
    ]);

    await page.goto("/");
    await expect(page.getByRole("link", { name: "Find content" })).toBeVisible();
    await expect(page.locator(".my-content")).toBeVisible();
  });

  test(
    "Can add and delete an artefact in publisher",
    { tag: ["@app-publisher", "@app-publishing-api", "@not-production"] },
    async ({ page, context }) => {
      // TODO: Remove once Publisher changes setting these feature toggles to default: true have been deployed
      await context.addCookies([
        {
          name: "design_system_edit_phase_3b",
          value: "1",
          url: publishingAppUrl("publisher"),
        },
        {
          name: "design_system_edit_phase_4",
          value: "1",
          url: publishingAppUrl("publisher"),
        },
      ]);

      // Go to the "publisher" landing page
      await page.goto("/");

      // Create new content - step 1
      await page.getByRole("link", { name: "Create new content" }).click();
      await page.getByRole("radio", { name: "Guide" }).check();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByRole("heading", { name: "Guide" })).toBeVisible();

      // Create new content - step 2
      const title = `Smokey Answer ${crypto.randomUUID()}`;
      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Slug").fill(title.toLowerCase().replaceAll(" ", "-"));
      await page.getByRole("button", { name: "Create content" }).click();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();

      // Delete the artefact
      await page.getByRole("link", { name: "Admin" }).click();
      await page.getByRole("link", { name: "Delete edition 1" }).click();
      await page.getByRole("button", { name: "Delete edition" }).click();

      // Verify the edition has been deleted
      await expect(page.getByText("Edition deleted")).toBeVisible();
    }
  );
});
