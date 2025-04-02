import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl, waitForUrlToBeAvailable } from "../lib/utils";

test.describe("Content Block Manager", { tag: ["@app-content-object-store"] }, () => {
  let embedCode;
  let value;

  const contentBlockPath = `${publishingAppUrl("whitehall-admin")}/content-block-manager/content-block/18`;
  const whitehallPath = "/government/admin/news/1658299";
  const mainstreamPath = "/editions/663e33d76187a0001afaf022";

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(contentBlockPath);

    const row = page.getByTestId("rate_1_amount");
    value = await row.locator(".govuk-summary-list__value").first().textContent();
    embedCode = await row.getAttribute("data-embed-code");
  });

  test.describe("When embedding content in Whitehall", () => {
    test.use({ baseURL: publishingAppUrl("whitehall-admin") });

    test("Can embed content in Whitehall", async ({ page }) => {
      await page.goto(whitehallPath);
      await page.getByRole("button", { name: "Edit draft" }).click();

      await page.getByLabel("Body (required)").fill("");
      await page.getByLabel("Body (required)").fill(embedCode);

      await page.getByRole("button", { name: "Save and go to document" }).click();

      const url = await waitForUrlToBeAvailable(
        page,
        await page.getByRole("link", { name: "Preview on website" }).getAttribute("href")
      );

      await page.goto(url);
      await expect(page.getByText(value)).toBeVisible();
    });
  });

  test.describe("When embedding content in Mainstream", () => {
    test.use({ baseURL: publishingAppUrl("publisher") });

    test("Can embed content in Mainstream", async ({ page }) => {
      await page.goto(mainstreamPath);

      await page.getByLabel("More information").fill("");
      await page.getByLabel("More information").fill(embedCode);

      await page.getByRole("button", { name: "Save" }).click();

      const url = await waitForUrlToBeAvailable(
        page,
        await page.getByRole("link", { name: "Preview" }).getAttribute("href")
      );

      await page.goto(url);
      await expect(page.getByText(value)).toBeVisible();
    });
  });

  test.describe("When content block changes", () => {
    let newValue;

    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage();
      // Set a new random value between £100 and £200
      newValue = `£${(Math.random() * (100.0 - 200.0) + 200.0).toFixed(2)}`;
      await page.goto(contentBlockPath);

      await page.getByRole("button", { name: "Edit pension" }).click();

      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.locator('[data-test-id="embedded_rate-1"]').getByRole("link", { name: "Edit" }).click();
      await page.getByLabel("Amount").click();
      await page.getByLabel("Amount").fill(newValue);
      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByLabel("No").check();
      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByLabel("Publish the edit now").check();
      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByLabel("confirm").check();
      await page.getByRole("button", { name: "Publish" }).click();
    });

    test.describe("For Whitehall content", () => {
      test.use({ baseURL: publishingAppUrl("whitehall-admin") });

      test("Whitehall value changes", async ({ page }) => {
        await page.goto(whitehallPath);

        const url = await waitForUrlToBeAvailable(
          page,
          await page.getByRole("link", { name: "Preview on website" }).getAttribute("href")
        );

        await expect(async () => {
          await page.goto(`${url}&cacheBust=${new Date().getTime()}`);
          await expect(page.getByText(newValue)).toBeVisible();
        }).toPass();
      });
    });

    test.describe("For Mainstream content", () => {
      test.use({ baseURL: publishingAppUrl("publisher") });

      test("Mainstream value changes", async ({ page }) => {
        await page.goto(mainstreamPath);

        const url = await waitForUrlToBeAvailable(
          page,
          await page.getByRole("link", { name: "Preview" }).getAttribute("href")
        );

        await expect(async () => {
          await page.goto(`${url}&cacheBust=${new Date().getTime()}`);
          await expect(page.getByText(newValue)).toBeVisible();
        }).toPass();
      });
    });
  });
});
