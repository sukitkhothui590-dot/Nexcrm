import { handleRequest } from "../server.js";

function apiPathFromRequest(req) {
  const url = new URL(req.url || "/", "http://localhost");
  const forwardedPath = url.searchParams.get("path") || "";
  let path = "";

  if (forwardedPath && forwardedPath !== ":path*" && !forwardedPath.includes(":")) {
    path = forwardedPath;
  } else {
    path = url.pathname
      .replace(/^\/api\/index(?:\.js)?\/?/, "")
      .replace(/^\/api\/?/, "");
    if (path === "index.js") path = "";
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
