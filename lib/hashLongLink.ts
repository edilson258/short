import crypto from "crypto";

export function hashLongLink(longLink: string) {
  const hashObj = crypto.createHash("sha512");
  return hashObj
    .update(longLink, "utf-8")
    .digest("base64")
    .replace("/", "-")
    .replace("+", "_")
    .substring(0, 6);
}
