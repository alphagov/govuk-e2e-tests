import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Government Frontend", { tag: ["@app-government-frontend"] }, () => {
  test("Check the frontend can talk to Content Store", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/topical-events/2014-overseas-territories-joint-ministerial-council/about");
    await expect(
      page.getByRole("heading", { name: "Priorities for the Overseas Territories Joint Ministerial Council 2014" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "The UK and the Overseas Territories share a vision for the Territories as vibrant and flourishing communities"
      )
    ).toBeVisible();
  });

  test("Check links to Email Alert Frontend work", { tag: ["@app-email-alert-frontend"] }, async ({ page }) => {
    await page.goto("/government/consultations/soft-drinks-industry-levy");
    await page.getByRole("button", { name: "Get emails about this page" }).first().click();
    await expect(page.getByText("You need a GOV.UK One Login to get these emails.")).toBeVisible();
  });
});
