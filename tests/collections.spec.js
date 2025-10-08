import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { XMLParser } from "fast-xml-parser";

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

  test("check application CSS loads", async ({ page, request }) => {
    await page.goto("/browse");
    const applicationCSSPath = await page
      .locator('link[rel="stylesheet"][href*="/assets/collections/application-"]')
      .getAttribute("href");
    const response = await request.get(`${applicationCSSPath}`);
    expect(response.status()).toBe(200);
  });

  test("feeds", { tag: ["@worksonmirror"] }, async ({ request }) => {
    const response = await request.get("/government/feed");
    expect(response.status()).toBe(200);
    const parser = new XMLParser();
    const atomFeed = parser.parse(await response.text());

    expect(atomFeed.feed.title).toBe("Activity on GOV.UK");
    expect(atomFeed.feed.entry.length).toBeGreaterThan(1);
  });

  test("organisations", async ({ page }) => {
    await page.goto("/government/organisations");
    await expect(page.getByRole("heading", { name: "Departments, agencies and public bodies" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Prime Minister's Office 10 Downing Street" })).toBeVisible();
    await page
      .getByRole("textbox", { label: /Search for a department, agency or public body/ })
      .pressSequentially("Cabinet Office");
    await expect(page.getByRole("link", { name: "Prime Minister's Office 10 Downing Street" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Cabinet Office", exact: true })).toBeVisible();
  });

  test("organisation", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/organisations/cabinet-office");
    await expect(page.getByRole("heading", { name: "Cabinet Office", exact: true })).toBeVisible();
  });

  test("organisation feed", { tag: ["@worksonmirror"] }, async ({ request }) => {
    const response = await request.get("/government/organisations/cabinet-office.atom");
    expect(response.status()).toBe(200);
    const parser = new XMLParser();
    const atomFeed = parser.parse(await response.text());

    expect(atomFeed.feed.title).toBe("Cabinet Office - Activity on GOV.UK");
    expect(atomFeed.feed.entry.length).toBeGreaterThan(1);
  });

  test("past chancellors", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/history/past-chancellors");
    await expect(page.getByRole("heading", { name: "Past Chancellors of the Exchequer", exact: true })).toBeVisible();
  });

  test("past foreign secretaries", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/history/past-foreign-secretaries");
    await expect(page.getByRole("heading", { name: "Past Foreign Secretaries", exact: true })).toBeVisible();
  });

  test("past foreign secretary", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/history/past-foreign-secretaries/charles-fox");
    await expect(page.getByRole("heading", { name: "Charles James Fox", exact: true })).toBeVisible();
  });

  test("past prime ministers", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/history/past-prime-ministers");
    await expect(page.getByRole("heading", { name: "Past Prime Ministers", exact: true })).toBeVisible();
  });

  test("past prime minister", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/history/past-prime-ministers/robert-walpole");
    await expect(page.getByRole("heading", { name: "Sir Robert Walpole", exact: true })).toBeVisible();
  });

  test("person", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/people/robert-walpole");
    await expect(page.getByRole("heading", { name: "Sir Robert Walpole", exact: true })).toBeVisible();
  });

  test("ministers", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/ministers");
    await expect(page.getByRole("heading", { name: "Ministers", exact: true })).toBeVisible();
  });

  test("ministerial role", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/ministers/prime-minister");
    await expect(page.getByRole("heading", { name: "Prime Minister", exact: true })).toBeVisible();
  });

  test("topical events", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/government/topical-events/coronation");
    await expect(page.getByRole("heading", { name: "Coronation", exact: true })).toBeVisible();
  });

  test("organisations api", { tag: ["@worksonmirror"] }, async ({ request }) => {
    const response = await request.get("/api/organisations");
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
    expect((await response.json()).results.length).toBeGreaterThan(1);
  });

  test("organisation api", { tag: ["@worksonmirror"] }, async ({ request }) => {
    const response = await request.get("/api/organisations/cabinet-office");
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
    expect((await response.json()).title).toBe("Cabinet Office");
  });

  test("courts and tribunal", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/courts-tribunals/administrative-court");
    await expect(page.getByRole("heading", { name: "Administrative Court", exact: true })).toBeVisible();
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

  test("embassies", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/embassies");
    await expect(
      page.getByRole("heading", { name: "Find a British embassy, high commission or consulate", exact: true })
    ).toBeVisible();
  });

  test("world location news", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/afghanistan/news");
    await expect(page.getByRole("heading", { name: "Afghanistan and the UK" })).toBeVisible();
    const latestSection = page.locator("#latest");
    await expect(latestSection.getByRole("heading", { name: "Latest" })).toBeVisible();
    await expect(latestSection.locator(".gem-c-document-list__item-metadata")).toHaveCount(3);
  });

  test("world location", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/world/afghanistan");
    await expect(page.getByRole("heading", { name: "UK help and services in Afghanistan" })).toBeVisible();
  });

  test("taxon page", { tag: ["@worksonmirror"] }, async ({ page }) => {
    await page.goto("/transport");
    await expect(page.getByRole("heading", { name: "Transport" })).toBeVisible();
  });

  test("email alerts for taxon page", { tag: ["@app-email-alert-frontend"] }, async ({ page }) => {
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
