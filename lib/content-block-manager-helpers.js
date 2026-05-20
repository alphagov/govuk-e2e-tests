import { publishingAppUrl } from "../lib/utils";
import { expect } from "@playwright/test";

export const saveAndContinue = (page) => page.getByRole("button", { name: "Save and continue" }).click();

export const verifyUpdatedRateVisible = async (page, updatedRate) =>
  expect(async () => {
    const url = await page.getByRole("link", { name: "Preview" }).getAttribute("href");

    await page.goto(`${url}?cacheBust=${Date.now()}`);
    await expect(page.getByText(updatedRate)).toBeVisible();
  }, `Expected page to have value ${updatedRate}`).toPass();

export const contentBlockPath = `${publishingAppUrl("content-block-manager")}/18`;
export const whitehallPath = `${publishingAppUrl("whitehall-admin")}/government/admin/editions/1658299`;
export const mainstreamPath = `${publishingAppUrl("publisher")}/editions/a3dc0cf7-00e4-4868-b0fd-2c33b4f47387`;
