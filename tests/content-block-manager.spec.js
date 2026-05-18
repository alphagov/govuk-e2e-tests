import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import {
  saveAndContinue,
  verifyUpdatedRateVisible,
  contentBlockPath,
  mainstreamPath,
  whitehallPath,
} from "../lib/content-block-manager-helpers";

test.describe.configure({ mode: "serial" });

test.describe("Content Block Manager", { tag: ["@app-content-block-manager"] }, () => {
  // Double timeout to allow for occasional congestion in Publishing API queues
  test.setTimeout(60_000);

  test("Can embed an object", async ({ page }) => {
    const newPensionRate = `£${(Math.random() * 100 + 100).toFixed(2)}`;

    const embedCode = await test.step("Given I have a content block with an embed code", async () => {
      await page.goto(contentBlockPath);

      const row = page.getByTestId("rate_1_amount");
      const code = await row.getAttribute("data-embed-code");

      expect(code, "Unable to find valid embed code").not.toBeNull();
      return code;
    });

    await test.step("When I embed the block in Whitehall", async () => {
      await page.goto(whitehallPath);
      await page.getByRole("button", { name: "Edit draft" }).click();
      await page.getByRole("textbox", { name: "Body" }).fill(embedCode);
      await page.getByRole("button", { name: "Save and go to document" }).click();
    });

    await test.step("And I embed the block in Mainstream", async () => {
      await page.goto(mainstreamPath);

      await page.getByRole("textbox", { name: "More information" }).fill(embedCode);
      await page.getByRole("button", { name: "Save" }).click();
    });

    await test.step("When I update the block value", async () => {
      await page.goto(contentBlockPath);

      await test.step("And I choose to edit the existing pension", async () => {
        await page.getByRole("button", { name: "Edit pension" }).click();
        await saveAndContinue(page);
      });

      await test.step("And I update the pension rate", async () => {
        await page.locator('[data-test-id="embedded_rate-1"]').getByRole("link", { name: "Edit" }).click();
        await page.getByLabel("Amount").fill(newPensionRate);
        await saveAndContinue(page);
      });

      await test.step("And I continue through the workflow to publish my changes", async () => {
        await saveAndContinue(page);
        await saveAndContinue(page);
        await saveAndContinue(page);
      });

      await test.step("And I choose not to inform users of my minor edit", async () => {
        await page.getByLabel("No").check();
        await saveAndContinue(page);
      });

      await test.step("And I choose for my changes to be published immediately", async () => {
        await page.getByLabel("Publish the edit now").check();
        await saveAndContinue(page);
      });

      await test.step("And I publish the changes", async () => {
        await page.getByLabel("confirm").check();
        await page.getByRole("button", { name: "Publish" }).click();
      });
    });

    await test.step("Then I should be able to see the updated value on my Whitehall document", async () => {
      await page.goto(whitehallPath);
      await verifyUpdatedRateVisible(page, newPensionRate);
    });

    await test.step("And I should be able to see the updated value on my Mainstream document", async () => {
      await page.goto(mainstreamPath);
      await verifyUpdatedRateVisible(page, newPensionRate);
    });
  });
});
