import { createServer } from "node:http";
import { server as mswServer, setMockResponse } from "./mocks/server";

const MOCK_API_BASE = "http://mock-api";
const PORT = 3099;

mswServer.listen({ onUnhandledRequest: "bypass" });

const bridgeServer = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check for Playwright readiness
  if (req.url === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Control endpoint: set mock response for the next request
  if (req.url === "/api/set-mock" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { method, path, status, data } = JSON.parse(body);
      setMockResponse({ method, path, status, body: data });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // Proxy all other requests through fetch — MSW intercepts these
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    const body = Buffer.concat(chunks);

    const headers: Record<string, string> = {};
    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    }
    if (req.headers["authorization"]) {
      headers["Authorization"] = req.headers["authorization"];
    }

    const fetchResponse = await fetch(`${MOCK_API_BASE}${req.url}`, {
      method: req.method,
      headers,
      body: body.length > 0 ? body : undefined,
    });
    const responseBody = await fetchResponse.text();
    res.writeHead(fetchResponse.status, {
      "Content-Type":
        fetchResponse.headers.get("Content-Type") || "application/json",
    });
    res.end(responseBody);
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Mock server error" }));
  }
});

bridgeServer.listen(PORT, () => {
  console.log(`Mock bridge server running on http://localhost:${PORT}`);
});
