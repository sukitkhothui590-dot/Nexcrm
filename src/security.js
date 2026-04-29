import crypto from "node:crypto";

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function issueSessionToken(userId, secret) {
  const payload = encodeBase64Url(JSON.stringify({
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  }));
  return `${payload}.${sign(payload, secret)}`;
}

export function readSessionToken(token, secret) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;
  if (sign(payload, secret) !== signature) return null;
  try {
    const session = JSON.parse(decodeBase64Url(payload));
    if (!session.userId || Date.now() > Number(session.exp || 0)) return null;
    return session;
  } catch {
    return null;
  }
}
