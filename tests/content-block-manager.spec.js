import { expect } from "@playwright/test";

import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe.configure({ mode: "serial" });

async function verifyUpdatedRateVisible(page, url, updatedRate) {
  await expect(async () => {
    await page.goto(`${url}?cacheBust=${Date.now()}`);
    await expect(page.getByText(updatedRate)).toBeVisible();
  }, `Expected page to have value ${updatedRate}`).toPass();
}

test.describe("Content Block Manager", { tag: ["@app-content-block-manager"] }, () => {
  // Double timeout to allow for occasional congestion in Publishing API queues
  test.setTimeout(60_000);

  const contentBlockPath = `${publishingAppUrl("content-block-manager")}/18`;
  const whitehallPath = `${publishingAppUrl("whitehall-admin")}/government/admin/editions/1658299`;
  const mainstreamPath = `${publishingAppUrl("publisher")}/editions/a3dc0cf7-00e4-4868-b0fd-2c33b4f47387`;

  test("Can embed an object", async ({ page }) => {
    let embedCode;
    let newValue;

    await test.step("Given I have a content block with an embed code", async () => {
      await page.goto(contentBlockPath);

      const row = page.getByTestId("rate_1_amount");
      embedCode = await row.getAttribute("data-embed-code");
    });

    await test.step("When I embed the block in Whitehall", async () => {
      await page.goto(whitehallPath);
      await page.getByRole("button", { name: "Edit draft" }).click();

      await page.getByLabel("Body (required)").fill("");
      await page.getByLabel("Body (required)").fill(embedCode);

      await page.getByRole("button", { name: "Save and go to document" }).click();
    });

    await test.step("And I embed the block in Mainstream", async () => {
      await page.goto(mainstreamPath);

      await page.getByLabel("More information").fill("");
      await page.getByLabel("More information").fill(embedCode);

      await page.getByRole("button", { name: "Save" }).click();
    });

    await test.step("When I update the block value", async () => {
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

      await page.getByLabel("No").check();
      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByLabel("Publish the edit now").check();
      await page.getByRole("button", { name: "Save and continue" }).click();

      await page.getByLabel("confirm").check();
      await page.getByRole("button", { name: "Publish" }).click();
    });

    await test.step("Then I should be able to see the updated value on my Whitehall document", async () => {
      await page.goto(whitehallPath);
      const url = await page.getByRole("link", { name: "Preview on website" }).getAttribute("href");

      await verifyUpdatedRateVisible(page, url, newValue);
    });

    await test.step("And I should be able to see the updated value on my Mainstream document", async () => {
      await page.goto(mainstreamPath);
      const url = await page.getByRole("link", { name: "Preview" }).getAttribute("href");

      await verifyUpdatedRateVisible(page, url, newValue);
    });
  });
});
