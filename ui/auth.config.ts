import { CredentialsSignin, NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import { login } from "./app/api/authApi";
import { any, ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";

// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password";
// }

const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? '',
    //   clientSecret: process.env.GITHUB_SECRET ?? ''
    // }),
    Credentials({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        const user = await login(credentials);

        if (user && user.data) {
          return {
            id: user.data.id,
            first_name: user.data.first_name,
            last_name: user.data.last_name,
            email: user.data.email,
            token: user.data.token, // Store token for requests
          };
        }
        return null;
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID ?? "",
    //   clientSecret: process.env.GOOGLE_SECRET ?? "",
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code",
    //     },
    //   },
    // }),
    // AzureADB2CProvider({
    //   clientId: process.env.AZURE_AD_B2C_CLIENT,
    //   clientSecret: process.env.AZURE_AD_B2C_SECRET,
    //   issuer: process.env.AZURE_AD_B2C_ISSURE,
    // }),
  ],
  pages: {
    signIn: "/", //sigin page,
    // error: '/test'
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update") {
        // console.log("token", token);
        // console.log("sessiom", session);
        token.first_name = session.user.first_name;
        token.last_name = session.user.last_name;
        token.email = session.user.email;
        // token.image = session.user.image;
        // token
      }

      if (user) {
        token.id = user.id;
        token.first_name = user.first_name; // ✅ Store first_name
        token.last_name = user.last_name; // ✅ Store last_name
        token.email = user.email;
        token.token = user.token; // ✅ Store auth token
        // token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.first_name = token.first_name; // ✅ Add first_name to session
      session.user.last_name = token.last_name; // ✅ Add last_name to session
      session.user.email = token.email;
      session.user.token = token.token; // ✅ Add auth token to session
      // session.user.image = token.image;
      return session;
    },
    // async signIn({ user }: { user: any }) {
    //   // console.log('wtf man', user);
    //   if (user) {
    //     setToken(user.token);
    //     return true;
    //   }
    //   return false;
    // }
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export default authConfig;
