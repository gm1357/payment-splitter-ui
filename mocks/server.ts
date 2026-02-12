import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

export function setMockResponse({
  method,
  path,
  status,
  body,
}: {
  method: keyof typeof http;
  path: string;
  status: number;
  body: object;
}) {
  const handler = http[method] as typeof http.get;
  server.use(
    handler(
      `http://mock-api${path}`,
      () => {
        return HttpResponse.json(body, { status });
      },
      { once: true },
    ),
  );
}
