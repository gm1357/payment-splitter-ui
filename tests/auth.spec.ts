import { test, expect } from "@playwright/test";

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

test.describe("Login page", () => {
  test("renders form fields and submit button", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1")).toContainText("Login");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("redirects to /dashboard on successful login", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForURL("**/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("shows server error on invalid credentials", async ({ page }) => {
    await setMock({
      method: "post",
      path: "/auth/login",
      status: 401,
      data: { message: "Invalid credentials", error: "Unauthorized" },
    });

    await page.goto("/login");

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });
});

test.describe("Register page", () => {
  test("renders all fields", async ({ page }) => {
    await page.goto("/register");

    await expect(page.locator("h1")).toContainText("Register");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });

  test("shows validation errors on empty submit and short password", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    // Test short password
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.getByText("Password must be at least 8 characters"),
    ).toBeVisible();
  });

  test("redirects to /dashboard on successful registration", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();

    await page.waitForURL("**/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("shows server error when email already exists", async ({ page }) => {
    await setMock({
      method: "post",
      path: "/user",
      status: 409,
      data: { message: "Email already exists", error: "Conflict" },
    });

    await page.goto("/register");

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("existing@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Email already exists")).toBeVisible();
  });
});
