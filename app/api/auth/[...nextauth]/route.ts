import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string | null | undefined;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
