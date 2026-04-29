import crypto from "node:crypto";

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}
