import { API_BASE, jsonHeaders } from "../constants/api";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HTTPMethod;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean>;
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  }
  return url.toString();
}

interface HttpError extends Error {
  status?: number;
  body?: unknown;
}

export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal, params } = opts;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    method,
    headers: jsonHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    let errBody: unknown = undefined;
    if (contentType.includes("application/json")) {
      errBody = await res.json().catch(() => undefined);
    } else {
      errBody = await res.text().catch(() => undefined);
    }

    let message = res.statusText;
    if (typeof errBody === "object" && errBody && "message" in errBody) {
      const candidate = (errBody as Record<string, unknown>).message;
      if (typeof candidate === "string" && candidate.trim()) {
        message = candidate;
      }
    } else if (typeof errBody === "string" && errBody.trim()) {
      message = errBody;
    }

    const error: HttpError = new Error(message);
    error.status = res.status;
    error.body = errBody;
    throw error;
  }

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
