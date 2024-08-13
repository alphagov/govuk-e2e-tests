import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Collections", { tag: ["@app-collections", "@domain-www"] }, () => {
  test("services and information navigation", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/browse");
    await expect(page.locator("#content").getByRole("heading", { name: "Services and information" })).toBeVisible();
    await page.getByRole("heading", { name: "Driving and transport" }).getByRole("link").click();
    await expect(page.getByRole("heading", { name: "Driving and transport" })).toBeVisible();
    await page.getByRole("link", { name: "Teaching people to drive" }).click();
    await expect(page.getByRole("heading", { name: "Teaching people to drive" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Apply to become a driving instructor" })).toBeVisible();
  });

  test("world services navigation", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world");
    await expect(page.getByRole("heading", { name: "Help and services around the world" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Afghanistan" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Zimbabwe" })).toBeVisible();
    await page.getByRole("textbox", { label: /Search for a country/ }).pressSequentially("USA");
    await expect(page.getByRole("link", { name: "USA" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Afghanistan" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Zimbabwe" })).toBeHidden();
  });

  test("world location news", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/afghanistan/news");
    await expect(page.getByRole("heading", { name: "Afghanistan and the UK" })).toBeVisible();
    const latestSection = page.locator("#latest");
    await expect(latestSection.getByRole("heading", { name: "Latest" })).toBeVisible();
    await expect(latestSection.locator(".gem-c-document-list__item-metadata")).toHaveCount(3);
  });

  test("Check the frontend can talk to Search API", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/afghanistan/news");
    const latestSection = page.locator("#latest");
    await expect(latestSection.getByRole("heading", { name: "Latest" })).toBeVisible();
    await expect(latestSection.locator(".gem-c-document-list__item-metadata")).toHaveCount(3);
  });

  test.describe("Email Alert Frontend", () => {
    test("Check the frontend can talk to Email Alert API", { tag: ["@app-email-alert-frontend"] }, async ({ page }) => {
      await page.goto("/education");
      await page.getByRole("link", { name: "Get emails for this topic" }).click();
      await expect(page.getByRole("heading", { name: "What do you want to get emails about?" })).toBeVisible();
      await page.getByText("Teaching and leadership").check();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByText("Teaching and leadership")).toBeVisible();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByRole("heading", { name: "How often do you want to get emails?" })).toBeVisible();
      await page.getByText("Once a week").check();
      await page.getByRole("button", { name: "Continue" }).click();
      await page.getByLabel("Enter your email address").fill("example@example.com");
    });
  });
});
