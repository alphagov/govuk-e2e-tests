import crypto from "crypto";
import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

const factCheckManagerPath = `${publishingAppUrl("fact-check-manager")}`;

test.describe("Fact Check Manager", { tag: ["@app-fact-check-manager"] }, () => {
  test.use({ baseURL: publishingAppUrl("publisher") });

  test(
    "Can send a Publisher edition for fact check and view it in Fact Check Manager",
    { tag: ["@app-publisher", "@app-publishing-api", "@not-production"] },
    async ({ page, context }) => {
      // TODO: Remove once FCM has been enabled as default
      await context.addCookies([
        {
          name: "fact_check_manager_api",
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
      const title = `Smokey Guide ${crypto.randomUUID()}`;
      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Slug").fill(title.toLowerCase().replaceAll(" ", "-"));
      await page.getByRole("button", { name: "Create content" }).click();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();

      // FCM keys requests on the Publisher edition ID
      const editionId = new URL(page.url()).pathname.match(/\/editions\/([^/]+)/)[1];

      // Skip 2i
      await page.getByRole("link", { name: "Send to 2i" }).click();
      await page.getByRole("button", { name: "Send to 2i" }).click();
      await page.getByRole("link", { name: "Skip review" }).click();
      await page.getByRole("button", { name: "Skip review" }).click();

      // Fill in FCM form
      const testEmailAddress = `simulate-delivered@notifications.service.gov.uk`;
      const changeReason = `Smokey fact check reason ${crypto.randomUUID()}`;
      await page.getByRole("button", { name: "Fact check" }).click();
      await page.getByLabel("Email addresses").fill(testEmailAddress);
      await page.getByLabel("Reason for change (optional)").fill(changeReason);
      await expect(page.getByLabel("Zendesk ticket number (optional)")).toBeVisible();
      await expect(page.getByRole("group", { name: "Deadline" })).toBeVisible();
      await page.getByRole("button", { name: "Continue" }).click();

      // Confirm and send to FCM
      await expect(page.getByRole("heading", { name: "Check email and send for fact check" })).toBeVisible();
      await expect(page.getByText(testEmailAddress)).toBeVisible();
      await expect(page.getByText(changeReason)).toBeVisible();
      await page.getByRole("button", { name: "Confirm and send for fact check" }).click();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.getByText("Sent to fact check")).toBeVisible();

      // Visit comparison in FCM
      await page.goto(`${factCheckManagerPath}/requests/publisher/${editionId}/compare`);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
  );
});
