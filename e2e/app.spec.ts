import { expect, test } from "@playwright/test";

test.describe("Baseline Application E2E Suite (Dual-Scenario)", () => {
  test.describe("Positive Scenarios (Happy Path)", () => {
    test("[POS-01] should render home page with title and main header", async ({ page }) => {
      const response = await page.goto("/");
      expect(response?.status()).toBeLessThan(400);

      await expect(page).toHaveTitle(/Hello World/i);
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText("Hello world!");
    });

    test("[POS-02] should navigate and render sub-route /about", async ({ page }) => {
      await page.goto("/about");

      await expect(page).toHaveTitle(/About/i);
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText("About");
    });
  });

  test.describe("Negative Scenarios (Unhappy Path & Boundary)", () => {
    test("[NEG-01] should gracefully handle non-existent routes with 404 page", async ({ page }) => {
      await page.goto("/non-existent-page-test-404");

      await expect(page).toHaveTitle(/Not Found/i);
      const notFoundHeading = page.locator("h1");
      await expect(notFoundHeading).toBeVisible();
      await expect(notFoundHeading).toHaveText("Page Not Found");
    });

    test("[NEG-02] should navigate routes without uncaught browser runtime exceptions", async ({ page }) => {
      const pageErrors: Array<Error> = [];
      page.on("pageerror", (error) => {
        pageErrors.push(error);
      });

      await page.goto("/");
      await page.goto("/about");
      await page.goto("/non-existent-page-test-404");

      expect(pageErrors).toHaveLength(0);
    });
  });
});
