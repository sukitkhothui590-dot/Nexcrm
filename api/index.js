import { handleRequest } from "../server.js";

function apiPathFromRequest(req) {
  const url = new URL(req.url || "/", "http://localhost");
  let path = url.searchParams.get("path") || "";
  if (!path || path === ":path*") {
    path = url.pathname.replace(/^\/api\/?/, "");
  }
  url.searchParams.delete("path");
  const query = url.searchParams.toString();
  return `/api/${path}${query ? `?${query}` : ""}`;
}

export default function handler(req, res) {
  req.url = apiPathFromRequest(req);
  return handleRequest(req, res);
}
