import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { logIntoSignon, publishingAppUrl } from "../lib/utils";

test.describe("Whitehall Assets", { tag: ["@app-asset-manager", "@domain-assets", "@domain-www"] }, () => {
  test("whitehall assets are redirected", async ({ request }) => {
    const assetPath =
      "/government/uploads/system/uploads/attachment_data/file/618167/government_dietary_recommendations.pdf";
    const response = await request.get(assetPath);
    expect(response.status()).toBe(200);
    expect(response.url()).toBe(publishingAppUrl("assets") + assetPath);
  });
});

test.describe("Assets", { tag: ["@app-asset-manager", "@domain-assets"] }, () => {
  test("asset are served", async ({ request }) => {
    const response = await request.get("/media/580768d940f0b64fbe000022/Target_incomes_calculator.xls");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/vnd.ms-excel");
  });
});

test.describe("Draft assets", { tag: ["@app-asset-manager", "@domain-draft-assets"] }, () => {
  test.use({ storageState: { cookies: [], origins: [] }, baseURL: publishingAppUrl("draft-assets") });

  test("draft assets require authentication", async ({ page }) => {
    await page.goto("/media/513a0efbed915d425e000002/120613_Albania_Travel_Advice_WEB_Ed2_jpeg.jpg");
    await logIntoSignon(page);
    expect(page.url()).toBe(
      publishingAppUrl("draft-assets") + "/media/513a0efbed915d425e000002/120613_Albania_Travel_Advice_WEB_Ed2_jpeg.jpg"
    );
    await expect(page.getByRole("img")).toBeVisible();
  });
});
