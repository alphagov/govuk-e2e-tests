function publishingAppUrl(appName) {
  return `https://${appName}.${process.env.PUBLISHING_DOMAIN}`;
}

async function logIntoSignon(page) {
  await page.getByLabel("Email", { exact: true }).fill(process.env.SIGNON_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(process.env.SIGNON_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
}

function useExponentialBackoffRetries(test) {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === testInfo.expectedStatus || testInfo.retry === testInfo.project.retries) return;

    const delay = testInfo.timeout * 2 ** testInfo.retry;
    testInfo.setTimeout(delay);

    console.info(`Exponential backoff: waiting ${delay}ms before the next attempt`);
    await page.waitForTimeout(delay);
  });
}

export { publishingAppUrl, logIntoSignon, useExponentialBackoffRetries };
