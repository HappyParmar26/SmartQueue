declare const require: any;
const http = require("http");
const https = require("https");
const { URL } = require("url");

export type HttpResponseResult = {
  response: Response;
  json: any;
  text: string;
};

export async function startTestServer(app: any): Promise<{ server: any; baseUrl: string }> {
  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to start test server");
  }

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

export async function stopTestServer(server: any): Promise<void> {
  if (!server) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error: Error | undefined) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function requestJson(
  baseUrl: string,
  method: string,
  path: string,
  body?: unknown,
  cookie?: string
): Promise<HttpResponseResult> {
  const url = new URL(path, baseUrl);
  const isHttps = url.protocol === "https:";
  const transport = isHttps ? https : http;
  const payload = body === undefined ? null : JSON.stringify(body);

  const response = await new Promise<any>((resolve, reject) => {
    const request = transport.request(
      url,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(cookie ? { cookie } : {}),
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      },
      (res: any) => {
        const chunks: Buffer[] = [];

        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          resolve({
            status: res.statusCode,
            headers: res.headers,
            text,
          });
        });
      }
    );

    request.on("error", reject);

    if (payload) {
      request.write(payload);
    }

    request.end();
  });

  let json: any = null;
  if (response.text) {
    try {
      json = JSON.parse(response.text);
    } catch {
      json = null;
    }
  }

  return {
    response: {
      status: response.status,
      headers: {
        get(name: string) {
          const value = response.headers[name.toLowerCase()];
          if (Array.isArray(value)) {
            return value.join(", ");
          }
          return value ?? null;
        },
      },
    } as Response,
    json,
    text: response.text,
  };
}