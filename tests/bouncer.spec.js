import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";

test.describe("Bouncer", () => {
  test("redirect transitioned site", { tag: ["@production", "@domain-www"] }, async ({ request }) => {
    const response = await request.get("http://www.attorneygeneral.gov.uk", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()["location"]).toBe("https://www.gov.uk/government/organisations/attorney-generals-office");
  });
});
