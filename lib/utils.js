import { expect } from "@playwright/test";

function publishingAppUrl(appName) {
  return process.env.ENVIRONMENT === "local"
    ? `http://${appName}.${process.env.PUBLISHING_DOMAIN}`
    : `https://${appName}.${process.env.PUBLISHING_DOMAIN}`;
}

async function logIntoSignon(page) {
  await page.getByLabel("Email", { exact: true }).fill(process.env.SIGNON_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(process.env.SIGNON_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
}

async function waitForUrlToBeAvailable(page, url) {
  console.log("here in wait");
  await expect(async () => {
    console.log("here before url");
    url = `${url}?cacheBust=${new Date().getTime()}`;
    console.log("here after url");
    const response = await page.request.get(url);
    expect(response.status()).toBe(200);
  }).toPass();
  return url;
}

export { publishingAppUrl, logIntoSignon, waitForUrlToBeAvailable };
