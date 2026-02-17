import { http, HttpResponse } from "msw";

export const defaultStatusResponse = {
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

export const defaultUserProfile = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
};

export const handlers = [
  http.get("http://mock-api/status", () => {
    return HttpResponse.json(defaultStatusResponse);
  }),
  http.post("http://mock-api/auth/login", () => {
    return HttpResponse.json({ access_token: "mock-jwt-token" });
  }),
  http.post("http://mock-api/user", () => {
    return new HttpResponse(null, { status: 201 });
  }),
  http.get("http://mock-api/user/profile", () => {
    return HttpResponse.json(defaultUserProfile);
  }),
];
