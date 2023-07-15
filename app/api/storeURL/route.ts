import { postgresURLRepository } from "@/repositories/implementations/postgres/url-repository";
import { TURLData } from "@/types/URLData";
import { storeURLRequestVaidator } from "@/lib/validators/storeURLRequestValidator";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let longURL, longURLHash;

  try {
    const parsedBody  = storeURLRequestVaidator.parse(body);
    longURL = parsedBody.longURL
    longURLHash = parsedBody.longURLHash
  } catch(err) {
    console.error("ERROR: Failed to parse url data:", err)
    return new Response(null, { status: 422 });
  }

  try {
    const url: TURLData = {
      _id: randomUUID(),
      longURL,
      longURLHash,
    };
    await postgresURLRepository.storeURL(url);
    return new Response(null, { status: 200 });
  } catch(err) {
    console.error("ERROR: Failed to save url:", err)
    return new Response(null, { status: 500 });
  }
}
