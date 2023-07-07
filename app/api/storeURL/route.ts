import {postgresURLRepository} from "@/repositories/implementations/postgres";
import {TURLData} from "@/types/URLData";
import {storeURLRequestVaidator} from "@/validators/storeURLRequestValidator";
import {randomUUID} from "crypto";
import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try { // try to parse data received from client
    const { longURL, longURLHash } = storeURLRequestVaidator.parse(body);
    const url: TURLData = {
      _id: randomUUID(), 
      longURL,
      longURLHash,
    };
    try { // try to store url to database
      await postgresURLRepository.storeURL(url);
    } catch (err) {
      return new Response(null, { status: 500 });
    }
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response(null, { status: 422 });
  }
}
