const { test, expect } = require("@playwright/test");

test.describe("Static", () => {
  test("Check the feedback component loads", { tag: ["@notcloudfront"] }, async ({ page }) => {
    await page.goto("/help");
    await page.getByRole("button", { name: "Report a problem with this page" }).click();
    await expect(page.getByRole("heading", { name: "Help us improve GOV.UK" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "What went wrong?" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Page is not useful" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Page is useful" }).click();
    await expect(page.getByText("Thank you for your feedback")).toBeVisible();
  });
});
