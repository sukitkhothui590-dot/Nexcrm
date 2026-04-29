import { handleRequest } from "./server.js";

function apiPathFromRequest(req) {
  const url = new URL(req.url || "/", "http://localhost");
  const path = url.searchParams.get("path") || "";
  url.searchParams.delete("path");
  const query = url.searchParams.toString();
  return `/api/${path}${query ? `?${query}` : ""}`;
}

export default function handler(req, res) {
  req.url = apiPathFromRequest(req);
  return handleRequest(req, res);
}
