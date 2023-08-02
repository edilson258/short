import { User } from "@/entities/User";
import { isPasswordEqual } from "@/lib/auth/user-password";
import { postgresUserRepository } from "@/repositories/implementations/postgres/user-repository";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_SECRET;

if (!googleClientId || !googleClientSecret)
  throw new Error("Failed to load google secrets");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
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
          throw new Error("Login failed provide valid information");
        }

        const user = await postgresUserRepository.findByEmail(email);
        if (!user) {
          throw new Error("Login failed provide valid information");
        }

        if (!(await isPasswordEqual(password.trim(), user.password))) {
          throw new Error(
            "Login failed, wrong email and password. Verify your credentials and try again",
          );
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
    signOut: "/signin",
    error: "/error",
  },

  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "credentials") {
        return true;
      } else if (account?.provider === "google") {
        // validating users data from.google provider
        if (!user.name || !user.email || !user.image) {
          return false;
        }

        // check if user's email already exists in our db
        const userAlreadyExists = await postgresUserRepository.findByEmail(
          user.email,
        );

        if (userAlreadyExists && userAlreadyExists.provider === "google") {
          return true;
        }

        if (!userAlreadyExists) {
          // create new User
          const newUser = new User({
            username: user.name,
            email: user.email,
            avatarURL: user.image,
            provider: "google",
          });
          await postgresUserRepository.save(newUser);
          return true;
        }

        throw new Error(
          "Your are trying to sigin using google account but the email of this account is aready in use by another user, please try a different google account",
        );
      } else {
        return false;
      }
    },

    async jwt(params) {
      if (params.account?.provider === "google") {
        return {
          ...params.token,
          _id: (
            await postgresUserRepository.findByEmail(params.token.email || "")
          )?._id,
        };
      }

      // when provider is credentials
      if (params.user) {
        return {
          ...params.token,
          _id: params.user.id,
        };
      }
      return params.token;
    },

    async session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          _id: params.token._id,
        },
      };
    },
  },
};
