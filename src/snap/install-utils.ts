import http from "http";
import { AddressInfo } from "net";
import handler from "serve-handler";

export function toUrl(address: AddressInfo | string): string {
  if (typeof address === "string") {
    return address;
  }
  return `http://localhost:${address.port}`;
}

export async function startSnapServer(snapDist: string): Promise<http.Server> {
  const server = http.createServer((req, res) => {
    void handler(req, res, {
      public: snapDist,
      headers: [
        {
          source: "**/*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-cache",
            },
            {
              key: "Access-Control-Allow-Origin",
              value: "*",
            },
          ],
        },
      ],
    });
  });
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      resolve();
    });
  });
  return server;
}
