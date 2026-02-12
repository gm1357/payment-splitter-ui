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

export const handlers = [
  http.get("http://mock-api/status", () => {
    return HttpResponse.json(defaultStatusResponse);
  }),
];
