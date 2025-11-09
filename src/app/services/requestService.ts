// src/services/requestService.ts
import { API_BASE, jsonHeaders } from "../constants/api";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HTTPMethod;
  body?: any;
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

export async function request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal, params } = opts;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    method,
    headers: jsonHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include", // optional: include cookies
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    // try to parse error body
    let errBody: any = undefined;
    if (contentType.includes("application/json")) {
      errBody = await res.json().catch(() => undefined);
    } else {
      errBody = await res.text().catch(() => undefined);
    }
    const error = new Error(errBody?.message ?? res.statusText);
    // attach extra info
    (error as any).status = res.status;
    (error as any).body = errBody;
    throw error;
  }

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // fallback: return raw text
  return (await res.text()) as unknown as T;
}
