import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Frontend", () => {
  test("Check homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Welcome to GOV.UK/);
  });

  test("Check help page loads", async ({ page }) => {
    await page.goto("/help");
    await expect(page.locator("body")).toContainText("Help using GOV.UK");
  });

  test("Check a/b page loads", async ({ page }) => {
    await page.goto("/help/ab-testing");
    await expect(page.locator("body")).toContainText("This is a test page");
  });

  test("Check the frontend can talk to Licensing", async ({ page }) => {
    await page.goto("/find-licences/busking-licence");
    await expect(page.locator("body")).toContainText("Busking licence");
    await page.getByLabel("Enter a postcode").fill("E20 2ST");
    await page.getByRole("button", { name: "Find" }).click();
    await expect(page.locator("body")).toContainText("Busking licence");
  });

  test("Check the frontend can talk to Asset Manager with media path", async ({ page }) => {
    await page.goto("/media/5a7b9f8ced915d4147621960/passport-impact-indicat.csv/preview");
    await expect(page.locator("body")).toContainText("Passport impact indicators - CSV version");
  });

  test("Check find your local council", async ({ page }) => {
    await page.goto("/find-local-council");
    await expect(page.locator("body")).toContainText("Find your local council");
    await page.getByLabel("Enter a postcode").fill("WV14 8TU");
    await page.getByRole("button", { name: "Find" }).click();
    await page.getByLabel("Select an address").selectOption("3, BRIERLEY LANE, BILSTON, WV14 8TU");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator("body")).toContainText("Dudley Metropolitan Borough Council");
  });

  test("Check the frontend can talk to Locations API and Local Links Manager API", async ({ page }) => {
    await page.goto("/pay-council-tax");
    await expect(page.locator("body")).toContainText("Pay your Council Tax");
    await page.getByLabel("Enter a postcode").fill("WC2B 6NH");
    await page.getByRole("button", { name: "Find" }).click();
    await expect(page.locator("body")).toContainText("Camden");
  });

  test("Check the frontend can talk to Elections API", async ({ page }) => {
    await page.goto("/contact-electoral-registration-office");
    await expect(page.locator("body")).toContainText("Electoral Registration Office");
    await page.goto("/contact-electoral-registration-office?postcode=sw1a+1aa");
    await expect(page.locator("body")).toContainText("Get help with electoral registration");
    await page.goto("/contact-electoral-registration-office?postcode=WV148TU");
    await expect(page.locator("body")).toContainText("Choose your address");
  });

  test("Check the frontend can talk to Places Manager", async ({ page }) => {
    await page.goto("/ukonline-centre-internet-access-computer-training");
    await expect(page.locator("body")).toContainText("Online Centres Network");
    await page.getByLabel("Enter a postcode").fill("WC2B 6NH");
    await page.getByRole("button", { name: "Find" }).click();
    await expect(page.locator("body")).toContainText("Holborn Library");
  });

  test("Check the travel advice index page loads", async ({ page }) => {
    await page.goto("/foreign-travel-advice");
    await expect(page.locator("body")).toContainText("Foreign travel advice");
    await expect(page.locator("body")).toContainText("Afghanistan");
    await expect(page.locator("body")).toContainText("Luxembourg");
  });
});
