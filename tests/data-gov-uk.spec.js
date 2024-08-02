import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Data.gov.uk", { tag: ["@app-dgu"] }, () => {
  test.use({ baseURL: `https://${process.env.DGU_DOMAIN}` });

  test("Check home page loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Find open data" })).toBeVisible();
  });

  test("Check search works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox", { name: "Search data.gov.uk" }).fill("data");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.locator(".dgu-results")).toBeVisible();
  });

  test("Check RDF API loads", async ({ page }) => {
    const response = await page.request.get("/dataset/lidar-composite-dtm-2017-1m.rdf");
    expect(response.status()).toBe(200);
  });

  test("Check organogram previews load", async ({ page }) => {
    await page.goto(
      "/dataset/7d114298-919b-4108-9600-9313e34ce3b8/organogram-of-staff-roles-salaries-september-2018/datafile/83a8d9f0-2d7c-433b-96f3-77866cddf058/preview"
    );
    await expect(page.getByText("View the full organogram")).toBeVisible();
    await expect(page.locator("#organogram .node")).toHaveCount(3);
  });
});

test.describe("CKAN", { tag: ["@app-dgu"] },() => {
  test.use({ baseURL: publishingAppUrl("ckan") });

  test("Check CKAN loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Data publisher")).toBeVisible();
  });

  test("Check CKAN action search API works", async ({ page }) => {
    const response = await page.request.get("/api/action/package_search?q=data");
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
  });
});
