import { storeLinkRequestVaidator } from "@/lib/validators/storeLinkRequestValidator";
import { postgresLinkRepository } from "@/repositories/implementations/postgres/link-repository";
import { NextRequest, NextResponse } from "next/server";
import Link from "@/entities/Link";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let userID, longLink;

  try {
    const parsedBody = storeLinkRequestVaidator.parse(body);
    userID = parsedBody.userID;
    longLink = parsedBody.longLink;
  } catch (err) {
    console.error("ERROR: Failed to parse link data:", err);
    return new Response(null, { status: 422 });
  }

  try {
    const link = new Link({ userID, longLink });
    await postgresLinkRepository.storeLink(link)
    return NextResponse.json({ link }, { status: 201 })
  } catch (err) {
    console.error("ERROR: Failed to save link:", err);
    return new Response(null, { status: 500 });
  }
}
