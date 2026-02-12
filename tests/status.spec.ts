import { test, expect } from "@playwright/test";

const statusResponse = {
  status: "ok",
  version: "1.0.0",
  nodeVersion: "v22.22.0",
  uptime: 4450.21,
  memory: {
    rss: 125587456,
    heapUsed: 36990088,
    heapTotal: 40247296,
  },
  details: {
    database: { status: "up", responseTimeMs: 2.68 },
    s3: { status: "up", responseTimeMs: 5.49 },
    sqs: { status: "up", responseTimeMs: 5.6 },
  },
};

const MOCK_SERVER_URL = "http://localhost:3099";

async function setMock({
  method,
  path,
  status,
  data,
}: {
  method: string;
  path: string;
  status: number;
  data: object;
}) {
  await fetch(`${MOCK_SERVER_URL}/api/set-mock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, path, status, data }),
  });
}

test.describe("Status page", () => {
  test("shows services and system info when API is healthy", async ({
    page,
  }) => {
    // Default MSW handler returns healthy status — no override needed
    await page.goto("/status");

    await expect(page.locator("h1")).toContainText("Status");
    await expect(page.getByText("Operational")).toBeVisible();

    await expect(page.getByText("database")).toBeVisible();
    await expect(page.getByText("s3", { exact: true })).toBeVisible();
    await expect(page.getByText("sqs")).toBeVisible();

    await expect(page.getByText("2.7 ms")).toBeVisible();
    await expect(page.getByText("5.5 ms")).toBeVisible();
    await expect(page.getByText("5.6 ms")).toBeVisible();

    await expect(page.getByText("1.0.0")).toBeVisible();
    await expect(page.getByText("1h 14m 10s")).toBeVisible();
  });

  test("shows degraded badge when status is not ok", async ({ page }) => {
    await setMock({
      method: "get",
      path: "/status",
      status: 200,
      data: {
        ...statusResponse,
        status: "error",
        details: {
          ...statusResponse.details,
          database: { status: "down", responseTimeMs: 0 },
        },
      },
    });

    await page.goto("/status");

    await expect(page.getByText("Degraded")).toBeVisible();
  });

  test("shows error page when API is down", async ({ page }) => {
    await setMock({
      method: "get",
      path: "/status",
      status: 500,
      data: { message: "Internal Server Error" },
    });

    await page.goto("/status");

    await expect(page.getByText("Something went wrong")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("retry button recovers after error", async ({ page }) => {
    // Set once: true override — first request returns 500, then default 200
    await setMock({
      method: "get",
      path: "/status",
      status: 500,
      data: { message: "Internal Server Error" },
    });

    await page.goto("/status");
    await expect(page.getByText("Something went wrong")).toBeVisible();

    await page.getByRole("button", { name: "Try again" }).click();

    await expect(page.getByText("Operational")).toBeVisible();
  });
});
