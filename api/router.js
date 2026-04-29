import { handleRequest } from "../server.js";

function firstQueryValue(value) {
  if (Array.isArray(value)) return value[0];
  return value || "";
}

function forwardedPath(req, url) {
  return String(url.searchParams.get("path") || firstQueryValue(req.query?.path) || "");
}

function apiPathFromRequest(req) {
  const url = new URL(req.url || "/", "http://localhost");
  const forwarded = forwardedPath(req, url);
  let path = "";

  if (forwarded && forwarded !== ":path*" && !forwarded.includes(":")) {
    path = forwarded;
  } else {
    path = url.pathname
      .replace(/^\/api\/router\/?/, "")
      .replace(/^\/api\/index(?:\.js)?\/?/, "")
      .replace(/^\/api\/?/, "");
    if (path === "router" || path === "index" || path === "index.js") path = "";
  }

  url.searchParams.delete("path");
  const query = url.searchParams.toString();
  const cleanPath = path.replace(/^\/+/, "");
  return `/api/${cleanPath}${query ? `?${query}` : ""}`;
}

export default function handler(req, res) {
  req.url = apiPathFromRequest(req);
  return handleRequest(req, res);
}
