import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Smart Answers", { tag: ["@app-smartanswers"] }, () => {
  test("Check the app is routable for a Smart Answer", async ({ page }) => {
    await page.goto("/vat-payment-deadlines");
    await expect(page.getByRole("heading", { name: /VAT payment deadline/i })).toBeVisible();
    await page.getByRole("button", { name: "Start now" }).click();
    await expect(page.getByRole("heading", { name: /When does your VAT accounting period end/i })).toBeVisible();
    await page.getByLabel("Month").fill("1");
    await page.getByLabel("Year").fill("2000");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: /How do you want to pay/i })).toBeVisible();
    await page.getByText("Direct debit").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: /Information based on your answers/i })).toBeVisible();
  });

  test("check application CSS loads", async ({ page, request }) => {
    await page.goto("/vat-payment-deadlines");
    const applicationCSSPath = await page
      .locator('link[rel="stylesheet"][href*="/assets/smartanswers/application-"]')
      .getAttribute("href");
    const response = await request.get(`${applicationCSSPath}`);
    expect(response.status()).toBe(200);
  });

  test("Check the frontend can talk to Worldwide API", async ({ page }) => {
    await page.goto("/check-uk-visa");
    await page.getByRole("button", { name: "Start now" }).click();
    await page
      .getByLabel("What’s your nationality as shown on your passport or travel document?")
      .selectOption("Australia");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByText("Tourism or visiting family and friends").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: /Information based on your answers/i })).toBeVisible();
  });
});
