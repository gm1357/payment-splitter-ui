interface ServiceDetail {
  status: "up" | "down";
  responseTimeMs: number;
}

interface StatusResponse {
  status: string;
  version: string;
  nodeVersion: string;
  uptime: number;
  memory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
  };
  details: Record<string, ServiceDetail>;
}

async function getStatus(): Promise<StatusResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/status`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Status request failed: ${response.status}`);
  }

  return response.json();
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export default async function Status() {
  const data = await getStatus();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Status</h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              data.status === "ok"
                ? "bg-green-500/15 text-green-600"
                : "bg-red-500/15 text-red-600"
            }`}
          >
            {data.status === "ok" ? "Operational" : "Degraded"}
          </span>
        </div>

        <div className="rounded-lg bg-foreground/5 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/50">
            Services
          </h2>
          <ul className="space-y-3">
            {Object.entries(data.details).map(([name, detail]) => (
              <li key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      detail.status === "up" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium capitalize">{name}</span>
                </div>
                <span className="font-mono text-sm text-foreground/50">
                  {detail.responseTimeMs.toFixed(1)} ms
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-foreground/5 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/50">
            System
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/50">Version</dt>
              <dd className="font-mono">{data.version}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/50">Uptime</dt>
              <dd className="font-mono">{formatUptime(data.uptime)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
