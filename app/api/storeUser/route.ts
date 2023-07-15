import { postgresUserRepository } from "@/repositories/implementations/postgres/user-repository";
import { User } from "@/entities/User";
import { storeUserRequestVaidator } from "@/lib/validators/storeUserRequestValidator";
import { NextRequest } from "next/server";
import { IUserData } from "@/entities/User";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let username, email, password;

  try {
    const parsedBody = storeUserRequestVaidator.parse(body);
    username = parsedBody.username;
    email = parsedBody.email;
    password = parsedBody.password;
  } catch (err) {
    console.error("ERROR: Failed to parse user data:", err);
    return new Response(null, { status: 422 });
  }

  const userAlreadyExists = await postgresUserRepository.findByEmail(email);
  if (userAlreadyExists) return new Response(null, { status: 409 });

  try {
    const userData: IUserData = {
      username,
      email,
      password,
    };
    const user = new User(userData);
    await postgresUserRepository.save(user);
    return new Response(null, { status: 201 });
  } catch (err) {
    console.error("ERROR: Failed to save user:", err);
    return new Response(null, { status: 500 });
  }
}
