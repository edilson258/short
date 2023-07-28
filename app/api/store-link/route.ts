import { storeLinkRequestVaidator } from "@/lib/validators/storeLinkRequestValidator";
import { postgresLinkRepository } from "@/repositories/implementations/postgres/link-repository";
import { NextRequest } from "next/server";
import Link from "@/entities/Link";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let userID, longLink, longLinkHash;

  try {
    const parsedBody = storeLinkRequestVaidator.parse(body);
    userID = parsedBody.userID;
    longLink = parsedBody.longLink;
    longLinkHash = parsedBody.longLinkHash;
  } catch (err) {
    console.error("ERROR: Failed to parse link data:", err);
    return new Response(null, { status: 422 });
  }

  try {
    const link = new Link({ userID, longLink, longLinkHash });
    await postgresLinkRepository.storeLink(link)
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("ERROR: Failed to save link:", err);
    return new Response(null, { status: 500 });
  }
}
