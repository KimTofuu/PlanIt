export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";

export const jsonHeaders = (token?: string) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};
