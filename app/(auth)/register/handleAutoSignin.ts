import { signIn } from "next-auth/react";

interface IHandleAutoSignInProps {
  email: string;
  password: string;
}

export async function handleAutoSignin({
  email,
  password,
}: IHandleAutoSignInProps): Promise<{ status: number, msg?: string }> {
  const signInResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (signInResult?.error) {
    return { status: 403, msg: signInResult.error };
  } else {
    return { status: 200 };
  }
}
