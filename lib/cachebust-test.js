import { test as base } from "@playwright/test";
import crypto from "crypto";

export const test = base.extend({
  page: async ({ page }, use) => {
    const cacheBustDomains = [process.env.PUBLIC_DOMAIN, `assets.${process.env.PUBLISHING_DOMAIN}`].join(",");
    const pattern = `https://{${cacheBustDomains}}/**/*`;
    await page.route(pattern, async (route) => {
      const cacheBust = crypto.randomBytes(3).toString("hex");
      const urlObj = new URL(route.request().url());
      urlObj.searchParams.set("cachebust", cacheBust);
      const url = urlObj.toString();
      await route.continue({ url });
    });
    await use(page);
  },
});
