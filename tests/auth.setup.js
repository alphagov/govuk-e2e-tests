import { test as setup } from "@playwright/test";
import { logIntoSignon, publishingAppUrl } from "../lib/utils";

const authFile = "tmp/.auth/user.json";
const signonBaseUrl = publishingAppUrl("signon");

setup("authenticate", async ({ page }) => {
  if (process.env.ENVIRONMENT !== "local") {
    await page.goto(signonBaseUrl);
    await logIntoSignon(page);
    await page.waitForURL(signonBaseUrl);
  }
  await page.context().storageState({ path: authFile });
});
