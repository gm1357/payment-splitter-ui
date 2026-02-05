import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Payment Splitter/);
});

test("get started link", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.locator("h1")).toContainText("Payment Splitter");
});
