import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";
import path from "path";

test.describe("Licensing", () => {
  test("Check licensing pages load", { tag: ["@app-licensify"] }, async ({ page }) => {
    await page.goto("/apply-for-a-licence/test-licence/gds-test/apply-1");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download the application form" }).click();
    const download = await downloadPromise;
    const downloadPath = "./tmp/downloads/" + download.suggestedFilename();
    await download.saveAs(downloadPath);

    await page.getByRole("link", { name: "Submit application" }).click();
    await expect(page.getByRole("heading", { name: "Submit the application" })).toBeVisible();
    await page.getByLabel("Email address", { exact: true }).fill("gds-testing@example.com");
    await page.getByLabel("Confirm email address").fill("gds-testing@example.com");

    await page.getByLabel("Application form").setInputFiles(path.join("./", downloadPath));
    await page.getByLabel("Ticking this box indicates").check();
    await page.getByRole("button", { name: "Continue to pay fee" }).click();

    await expect(page.getByRole("heading", { name: "Pay the licence fee" })).toBeVisible();
    await page.getByRole("link", { name: "Continue to WorldPay website" }).click();
    await expect(page).toHaveURL(/\.worldpay\.com/);
  });
});

test.describe("Licensing admin", () => {
  test.use({ baseURL: publishingAppUrl("licensify-admin") });
  test(
    "Check log in to licensify-admin",
    {
      tag: ["@app-licensify", "@publishing-app"],
    },
    async ({ page }) => {
      test.slow();
      await page.goto("/");
      await page.getByRole("button", { name: "Login" }).click();
      (page.waitForURL(/\/gds-test\//, { timeout: 60000 }),
        await expect(page.getByRole("link", { name: "Applications" })).toBeVisible());
    }
  );
});
