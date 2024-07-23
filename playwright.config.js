import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  outputDir: "tmp/test-results",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "dot" : "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `https://${process.env.PUBLIC_DOMAIN}`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "setup", testMatch: /.*\.setup\.js/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tmp/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "mirrorS3",
      use: {
        ...devices["Desktop Chrome"],
        extraHTTPHeaders: {
          "Backend-Override": "mirrorS3",
        },
      },
      grep: /@worksonmirror/,
    },
    {
      name: "mirrorS3Replica",
      use: {
        ...devices["Desktop Chrome"],
        extraHTTPHeaders: {
          "Backend-Override": "mirrorS3Replica",
        },
      },
      grep: /@worksonmirror/,
    },
    {
      name: "mirrorGCS",
      use: {
        ...devices["Desktop Chrome"],
        extraHTTPHeaders: {
          "Backend-Override": "mirrorGCS",
        },
      },
      grep: /@worksonmirror/,
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
});
