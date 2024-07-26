import { expect } from "@playwright/test";
import { test } from "../lib/cachebust-test";
import { XMLParser } from "fast-xml-parser";

test.describe("Search API", { tag: ["@app-search-api"] }, () => {
  test("Check the app is routable", { tag: ["@worksonmirror"] }, async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const parser = new XMLParser();
    const sitemap = parser.parse(await response.text());

    expect(sitemap.sitemapindex.sitemap.filter((e) => e.loc).length).toBeGreaterThan(1);
  });
});
