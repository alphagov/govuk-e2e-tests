import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Frontend", { tag: ["@app-frontend", "@domain-www"] }, () => {
  test("homepage", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Welcome to GOV.UK/);
    await expect(
      page.getByRole("heading", { name: "GOV.UK - The best place to find government services and information" })
    ).toBeVisible();
  });

  test("help page", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/help");
    await expect(page.getByRole("heading", { name: "Help using GOV.UK" })).toBeVisible();
  });

  test("a/b page", async ({ page }) => {
    await page.goto("/help/ab-testing");
    await expect(page.getByRole("heading", { name: "This is a test page" })).toBeVisible();
  });

  test("cookies", async ({ page, context }) => {
    await page.goto("/help/cookies");
    await expect(page.getByRole("heading", { name: "Cookies on GOV.UK" })).toBeVisible();
    let cookies = await context.cookies();
    expect(cookies.find((c) => c.name == "cookies_policy").value).toBe(
      '{"essential":true,"settings":false,"usage":false,"campaigns":false}'
    );
    await page.getByText("Use cookies that measure my website use", { exact: true }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.reload();
    cookies = await context.cookies();
    expect(cookies.find((c) => c.name == "cookies_policy").value).toBe(
      '{"essential":true,"settings":false,"usage":true,"campaigns":false}'
    );
    await page.getByText("Use cookies that help with communications and marketing", { exact: true }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.reload();
    cookies = await context.cookies();
    expect(cookies.find((c) => c.name == "cookies_policy").value).toBe(
      '{"essential":true,"settings":false,"usage":true,"campaigns":true}'
    );
    await page.getByText("Use cookies that remember my settings on the site", { exact: true }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.reload();
    cookies = await context.cookies();
    expect(cookies.find((c) => c.name == "cookies_policy").value).toBe(
      '{"essential":true,"settings":true,"usage":true,"campaigns":true}'
    );
  });

  test("roadmap", async ({ page }) => {
    await page.goto("/roadmap");
    await expect(page.getByRole("heading", { name: "GOV.UK roadmap" })).toBeVisible();
  });

  test("contact electoral registration office", async ({ page }) => {
    await page.goto("/contact-electoral-registration-office");
    await expect(page.getByRole("heading", { name: "Contact your Electoral Registration Office" })).toBeVisible();
    await page.getByLabel("Enter a postcode").fill("WV14 8TU");
    await page.getByRole("button", { name: "Find" }).click();
    await page.getByLabel("Select an address").selectOption("3 BRIERLEY LANE, BILSTON");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Dudley Metropolitan Borough Council", { exact: true })).toBeVisible();
    await expect(page.getByText("Electoral Services Dudley")).toBeVisible();
  });

  test("find your local council", { tag: ["@app-local-links-manager", "@app-locations-api"] }, async ({ page }) => {
    await page.goto("/find-local-council");
    await expect(page.getByRole("heading", { name: "Find your local council" })).toBeVisible();
    await page.getByLabel("Enter a postcode").fill("WV14 8TU");
    await page.getByRole("button", { name: "Find" }).click();
    await page.getByLabel("Select an address").selectOption("3, BRIERLEY LANE, BILSTON, WV14 8TU");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Dudley Metropolitan Borough Council", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Go to Dudley Metropolitan" })).toBeVisible();
  });

  test("foreign travel advice index", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/foreign-travel-advice");
    await expect(page.getByRole("heading", { name: "Foreign travel advice" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Afghanistan" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Zimbabwe" })).toBeVisible();
    await page.getByRole("textbox", { label: /Search for a country/ }).pressSequentially("USA");
    await expect(page.getByRole("link", { name: "USA" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Afghanistan" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Zimbabwe" })).toBeHidden();
  });

  test("signin", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: "Sign in to a service" })).toBeVisible();
  });

  test("find a licence", async ({ page }) => {
    await page.goto("/find-licences/busking-licence");
    await expect(page.getByRole("heading", { name: "Busking licence" })).toBeVisible();
    await page.getByLabel("Enter a postcode").fill("E20 2ST");
    await page.getByRole("button", { name: "Find" }).click();
    await page.getByText("WEST HAM UNITED FOOTBALL CLUB").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("You cannot apply for this licence online.")).toBeVisible();
  });

  test("simple smart answer", async ({ page }) => {
    await page.goto("/contact-the-dvla");
    await expect(page.getByRole("heading", { name: "Contact DVLA" })).toBeVisible();
    await page.getByRole("button", { name: "Find contact details" }).click();
    await page.getByText("Something else").check();
    await page.getByRole("button", { name: "Next step" }).click();
    await page.getByText("Complaints").check();
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByRole("heading", { name: "Complaints", exact: true })).toBeVisible();
  });

  test("transaction start page", async ({ page }) => {
    await page.goto("/register-to-vote");
    await expect(page.getByRole("heading", { name: "Register to vote", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start now" })).toBeVisible();
  });

  test("local transaction page", { tag: ["@app-local-links-manager", "@app-locations-api"] }, async ({ page }) => {
    await page.goto("/pay-council-tax");
    await expect(page.getByRole("heading", { name: "Pay your Council Tax" })).toBeVisible();
    await page.getByLabel("Enter a postcode").fill("WC2B 6NH");
    await page.getByRole("button", { name: "Find" }).click();
    await expect(page.getByText("London Borough of Camden", { exact: true })).toBeVisible();
  });

  test("place page", { tag: ["@app-places-manager", "@app-locations-api"] }, async ({ page }) => {
    await page.goto("/ukonline-centre-internet-access-computer-training");
    await expect(page.getByRole("heading", { name: "Online Centres Network" })).toBeVisible();
    await page.getByLabel("Enter a postcode").fill("WC2B 6NH");
    await page.getByRole("button", { name: "Find" }).click();
    await expect(page.getByRole("heading", { name: "Holborn Library" })).toBeVisible();
  });

  test("csv previews for assets", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/media/5a7b9f8ced915d4147621960/passport-impact-indicat.csv/preview");
    await expect(page.getByRole("heading", { name: "Passport impact indicators - CSV version" })).toBeVisible();
  });

  test("bank holidays", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/bank-holidays");
    await expect(page.getByRole("heading", { name: "UK bank holidays" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The next bank holiday in England and Wales" })).toBeVisible();
    await page.getByRole("tab", { name: "Scotland" }).click();
    await expect(page.getByRole("heading", { name: "The next bank holiday in Scotland" })).toBeVisible();
    await page.getByRole("tab", { name: "Northern Ireland" }).click();
    await expect(page.getByRole("heading", { name: "The next bank holiday in Northern Ireland" })).toBeVisible();
  });

  test("welsh translated bank holidays", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/gwyliau-banc");
    await expect(page.getByRole("heading", { name: "Gwyliau banc y DU" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Yr ŵyl banc nesaf yng Nghymru a Lloegr yw" })).toBeVisible();
    await page.getByRole("tab", { name: "yr Alban" }).click();
    await expect(page.getByRole("heading", { name: "Yr ŵyl banc nesaf yn yr Alban yw" })).toBeVisible();
    await page.getByRole("tab", { name: "Gogledd Iwerddon" }).click();
    await expect(page.getByRole("heading", { name: "Yr ŵyl banc nesaf yng Ngogledd Iwerddon yw" })).toBeVisible();
  });

  test("Check the frontend can talk to Search API", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/get-involved");
    await expect(page.getByRole("heading", { name: "Recently opened" })).toBeVisible();
    await expect(page.locator("main > div").nth(3).locator(".gem-c-document-list__item-title")).toHaveCount(3);
  });
});
