import crypto from "crypto";

export function makeURLShort(longURL: string) {
  const hashObj = crypto.createHash("sha512");
  return hashObj
    .update(longURL, "utf-8")
    .digest("base64")
    .replace("/", "-")
    .replace("+", "_")
    .substring(0, 6);
}
