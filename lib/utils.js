function publishingAppUrl(appName) {
  return `https://${appName}.${process.env.PUBLISHING_DOMAIN}`;
}

async function logIntoSignon(page) {
  await page.getByLabel("Email").fill(process.env.SIGNON_EMAIL);
  await page.getByLabel("Password").fill(process.env.SIGNON_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export { publishingAppUrl, logIntoSignon };
