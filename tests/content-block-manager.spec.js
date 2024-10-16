import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl, waitForUrlToBeAvailable } from "../lib/utils";

test.describe("Content Block Manager", { tag: ["@app-content-object-store", "@integration", "@local"] }, () => {
  test.use({ baseURL: `${publishingAppUrl("whitehall-admin")}/content-block-manager/` });

  test("Can create an object", async ({ page }) => {
    await test.step("Logging in", async () => {
      await page.goto("./");
      await expect(page.getByRole("banner", { text: "Content Block Manager" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "All content blocks" })).toBeVisible();
    });

    const title = `E2E TEST EMAIL - ${new Date().getTime()}`;

    await page.goto("./");
    await page.getByRole("button", { text: "Create new object" }).click();
    await page.getByLabel("Email address").click();
    await page.getByRole("button", { text: "Save and continute" }).click();

    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Email address").fill(`foo${new Date().getTime()}@example.com`);

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "HM Revenue & Customs (HMRC)" }).click();
    await page.getByRole("button", { name: "Save and continue" }).click();
    await page.getByRole("button", { name: "Accept and publish" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your content block is available for use");
  });

  test("Can edit an object", async ({ page }) => {
    await test.step("Logging in", async () => {
      await page.goto("./");
      await expect(page.getByRole("banner", { text: "Content Block Manager" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "All content blocks" })).toBeVisible();
    });

    const title = `E2E TEST EMAIL - ${new Date().getTime()}`;

    await page.goto("./");
    const block_count = await page.getByRole("link", { name: "View/edit" }).count();
    await page
      .getByRole("link", { name: "View/edit" })
      .nth(block_count - 1)
      .click();
    await page.getByRole("link", { name: "Change" }).nth(1).click();

    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Email address").fill(`foo${new Date().getTime()}@example.com`);

    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Where the change will appear");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("When do you want to publish the change?");
    await page.getByLabel("Publish the change now").check();
    await page.getByRole("button", { name: "Accept and publish" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your content block is available for use");
  });

  test("Can schedule an object", async ({ page }) => {
    await test.step("Logging in", async () => {
      await page.goto("./");
      await expect(page.getByRole("banner", { text: "Content Block Manager" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "All content blocks" })).toBeVisible();
    });

    const title = `E2E TEST EMAIL - ${new Date().getTime()}`;

    await page.goto("./");
    const block_count = await page.getByRole("link", { name: "View/edit" }).count();
    await page
      .getByRole("link", { name: "View/edit" })
      .nth(block_count - 1)
      .click();
    await page.getByRole("link", { name: "Change" }).nth(1).click();

    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Email address").fill(`foo${new Date().getTime()}@example.com`);

    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Where the change will appear");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("When do you want to publish the change?");
    await page.getByLabel("Schedule the change for the future").check();
    await page.getByLabel("Day").fill("01");
    await page.getByLabel("Month").fill("02");
    await page.getByLabel("Year").fill("2025");
    await page.getByLabel("Hour").selectOption("00");
    await page.getByLabel("Minute").selectOption("00");
    await page.getByRole("button", { name: "Accept and publish" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your content block is scheduled for change");
  });
});

test.describe("Content Blocks in Whitehall", { tag: ["@app-content-object-store", "@integration"] }, () => {
  test.use({ baseURL: `${publishingAppUrl("whitehall-admin")}/content-block-manager/` });

  test("Can create and embed an object", async ({ page }) => {
    await test.step("Logging in", async () => {
      await page.goto("./");
      await expect(page.getByRole("banner", { text: "Content Block Manager" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "All content blocks" })).toBeVisible();
    });

    const title = await test.step("Can create an object", async () => {
      const title = `E2E TEST EMAIL - ${new Date().getTime()}`;

      await page.goto("./");
      await page.getByRole("button", { text: "Create new object" }).click();
      await page.getByLabel("Email address").click();
      await page.getByRole("button", { text: "Save and continute" }).click();

      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Email address").fill(`foo${new Date().getTime()}@example.com`);

      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: "HM Revenue & Customs (HMRC)" }).click();
      await page.getByRole("button", { name: "Save and continue" }).click();
      await page.getByRole("button", { name: "Accept and publish" }).click();

      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your content block is available for use");

      await page.getByRole("button", { name: "View content block" }).click();

      return title;
    });

    const url = await test.step("Can embed an object", async () => {
      const summaryCardRows = page
        .locator(".govuk-summary-list")
        .filter({ hasText: title })
        .locator(".govuk-summary-list__row");

      const emailAddress = await summaryCardRows
        .filter({ hasText: "Email address" })
        .locator(".govuk-summary-list__value")
        .textContent();

      const embedCode = await summaryCardRows
        .filter({ hasText: "Embed code" })
        .locator(".govuk-summary-list__value")
        .textContent();

      await page.goto(publishingAppUrl("whitehall-admin"));

      await page.getByRole("link", { name: "New document" }).click();
      await page.getByLabel("News article").check();
      await page.getByRole("button", { name: "Next" }).click();

      await page.locator(".choices__item").first().click();
      await page.getByRole("option", { name: "News story", exact: true }).click();

      const documentTitle = `TEST DOCUMENT - ${new Date().getTime()}`;

      await page.getByLabel("Title (required)").fill(documentTitle);
      await page.getByLabel("Summary (required)").fill("Some summary");
      await page.getByLabel("Body (required)").fill(`Text goes here - ${embedCode}`);
      await page.getByRole("button", { name: "Save and go to document" }).click();
      await page.getByRole("link", { name: "Add tags" }).click();
      await page
        .locator('[id="taxonomy_tag_form\\[taxons\\]"]')
        .getByRole("list")
        .locator("div")
        .filter({ hasText: "Test taxon" })
        .click();
      await page.getByRole("button", { name: "Save" }).click();
      await page.getByRole("button", { name: "Force publish" }).click();
      await page.getByLabel("Reason for force publishing").fill("Some reason");
      await page.getByRole("button", { name: "Force publish" }).click();

      await page.getByRole("link", { name: documentTitle }).click();
      const url = await waitForUrlToBeAvailable(
        page,
        await page.getByRole("link", { name: "View on website" }).getAttribute("href")
      );

      await page.goto(url);
      await expect(page.getByText(emailAddress)).toBeVisible();

      return url;
    });

    await test.step("Dependent content updates when block content changes", async () => {
      await page.goto("./");

      await page
        .getByRole("link")
        .filter({ hasText: `View/edit ${title}` })
        .click();

      await page.locator(".govuk-summary-list").getByRole("link").filter({ hasText: "Change" }).first().click();

      const emailAddress = `foo${new Date().getTime()}@example.org`;
      await page.getByLabel("Email address").fill(emailAddress);
      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByRole("button", { name: "Save and continue" }).click();
      await page.getByLabel("Publish the change now").check();
      await page.getByRole("button", { name: "Accept and publish" }).click();

      await page.goto(url);
      await expect(page.getByText(emailAddress)).toBeVisible();
    });
  });
});
