import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Content Store", () => {
  test("Check the app is routable", async ({ request }) => {
    const response = await request.get("/api/content/help");
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
  });
});
