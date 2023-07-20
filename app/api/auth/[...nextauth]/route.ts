import { postgresUserRepository } from "@/repositories/implementations/postgres/user-repository";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Login failed provide valid information")
        }

        const user = await postgresUserRepository.findByEmail(email);
        if (!user) {
          throw new Error("Login failed provide valid information")
        }

        if (password !== user.password) {
          throw new Error("Login failed, wrong email and password. Verify your credentials and try again")
        }

        return {
          id: user._id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/",
    signOut: "/signin"
  },
});

export { handler as GET, handler as POST };
