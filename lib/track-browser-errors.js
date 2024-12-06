import { expect } from "@playwright/test";

// trackBrowserErrors enhances a test suite with error tracking for Javascript errors, console
// errors, and network errors. It keeps track of errors for every test, and will fail if any issues
// are encountered.
const trackBrowserErrors = (test) => {
  let problems = [];

  test.beforeEach(async ({ page }) => {
    problems = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const location = msg.location();
        const locationText = `${location.url}:${location.lineNumber}:${location.columnNumber}`;

        problems.push(`${msg.text()}\n    at ${locationText}`);
      }
    });

    page.on("pageerror", (error) => {
      problems.push(error.message);
    });

    page.on("requestfailed", (request) => {
      problems.push(request.failure().errorText);
    });
  });

  test.afterEach(async () => {
    expect(problems, "Encountered Javascript issues on page").toEqual([]);
  });
};

export { trackBrowserErrors };
