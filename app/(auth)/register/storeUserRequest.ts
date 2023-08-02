import { storeUserRequestVaidator } from "@/lib/validators/storeUserRequestValidator";
import { z } from "zod";

interface IStoreUserRequestProps {
  username: string;
  email: string;
  password: string;
}

export async function createUserRequest({
  username,
  email,
  password,
}: IStoreUserRequestProps): Promise<{ status: number }> {
  type TStoreUserPayload = z.infer<typeof storeUserRequestVaidator>;
  const storeUserPayload: TStoreUserPayload = {
    username,
    email,
    password,
  };

  const response = await fetch("/api/store-user", {
    method: "POST",
    body: JSON.stringify(storeUserPayload),
  });

  return { status: response.status };
}
