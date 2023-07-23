import { postgresUserRepository } from "@/repositories/implementations/postgres/user-repository";
import { User } from "@/entities/User";
import { storeUserRequestVaidator } from "@/lib/validators/storeUserRequestValidator";
import { NextRequest } from "next/server";
import { hashPassword } from "@/lib/auth/user-password";

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
    password = await hashPassword(password.trim());
    const user = new User({
      username,
      email,
      password,
      provider: "credentials",
    });
    await postgresUserRepository.save(user);
    return new Response(null, { status: 201 });
  } catch (err) {
    console.error("ERROR: Failed to save user:", err);
    return new Response(null, { status: 500 });
  }
}
