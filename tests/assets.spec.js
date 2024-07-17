import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { logIntoSignon, publishingAppUrl } from "../lib/utils";

test.describe("Assets", () => {
  test(
    "Check whitehall assets are redirected to and served from the asset host",
    { tag: ["@app-whitehall", "@app-asset-manager"] },
    async ({ request }) => {
      const assetPath =
        "/government/uploads/system/uploads/attachment_data/file/618167/government_dietary_recommendations.pdf";
      const response = await request.get(assetPath);
      expect(response.status()).toBe(200);
      expect(response.url()).toBe(`https://assets.${process.env.PUBLISHING_DOMAIN}${assetPath}`);
    }
  );

  test("Check an asset can be served", { tag: ["@app-asset-manager"] }, async ({ request }) => {
    const response = await request.get("/media/580768d940f0b64fbe000022/Target_incomes_calculator.xls");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/vnd.ms-excel");
  });
});

test.describe("Draft assets", () => {
  test.use({ storageState: { cookies: [], origins: [] }, baseURL: publishingAppUrl("draft-assets") });

  test("Check a draft assets can be served", { tag: ["@app-asset-manager"] }, async ({ page }) => {
    await page.goto("/media/513a0efbed915d425e000002/120613_Albania_Travel_Advice_WEB_Ed2_jpeg.jpg");
    await logIntoSignon(page);
    expect(page.url()).toBe(
      publishingAppUrl("draft-assets") + "/media/513a0efbed915d425e000002/120613_Albania_Travel_Advice_WEB_Ed2_jpeg.jpg"
    );
    await expect(page.getByRole("img")).toBeVisible();
  });
});
