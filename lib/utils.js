function publishingAppUrl(appName) {
  return `https://${appName}.${process.env.PUBLISHING_DOMAIN}`;
}

async function logIntoSignon(page) {
  await page.getByLabel("Email", { exact: true }).fill(process.env.SIGNON_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(process.env.SIGNON_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export { publishingAppUrl, logIntoSignon };
