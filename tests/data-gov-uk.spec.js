import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { publishingAppUrl } from "../lib/utils";

test.describe("Data.gov.uk", { tag: ["@app-dgu"] }, () => {
  test.use({ baseURL: "https://data.gov.uk/" });

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

test.describe("CKAN", () => {
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

  test("Check datasets sync between CKAN and Find", async ({ page }) => {
    await page.goto("/dataset?q=");
    const ckanDatasetCountString = page.locator(".search-form h1").first();
    await expect(ckanDatasetCountString).toHaveText(/(\d{1,3}(,\d{3})*) datasets found/, { useInnerText: true });
    const ckanDatasetCount = parseInt((await ckanDatasetCountString.innerText()).replace(/,/g, ""));

    // Data.gov.uk
    await page.goto("https://data.gov.uk");
    await page.getByRole("searchbox", { name: "Search data.gov.uk" }).fill("");
    await page.getByRole("button", { name: "Search" }).click("data");
    const dataGovUkDatasetCountString = page.locator(".dgu-results__summary > span");
    await expect(dataGovUkDatasetCountString).toHaveText(/(\d{1,3}(,\d{3})*)/, { useInnerText: true });
    const dataGovUkDatasetCount = parseInt((await dataGovUkDatasetCountString.innerText()).replace(/,/g, ""));

    const countDiff = Math.abs(ckanDatasetCount - dataGovUkDatasetCount);

    expect(countDiff).toBeLessThan(25);
  });
});
