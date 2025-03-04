import { CredentialsSignin, NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import { login, verifyCode } from "./app/api/authApi";
import { any, ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";

// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password";
// }

interface CredentialsType {
  email: string;
  password: string;
  twoFactorCode?: string;
}

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
        twoFactorCode: { type: "text", optional: true },
      },
      async authorize(credentials) {
        const { email, password, twoFactorCode } =
          credentials as CredentialsType;

        let user;

        try {
          // ✅ Attempt login with 2FA code if provided
          user = await login({
            email,
            password,
            twoFactorCode: twoFactorCode ?? null,
          });

          // 🚨 If authentication failed, return `null`
          if (!user?.data || user.data.status === false) {
            return null;
          }

          // ❌ If 2FA is required but no code was provided, prevent login
          if (user.data.two_factor && !twoFactorCode) {
            throw new Error("2FA required");
          }

          // ✅ Successful authentication, return user data
          return {
            id: user.data.id,
            first_name: user.data.first_name,
            last_name: user.data.last_name,
            email: user.data.email,
            token: user.data.token,
            two_factor: user.data.two_factor, // ✅ Ensure this updates properly
          };
        } catch (error) {
          // 🚨 Handle errors gracefully (optional logging)
          console.error("Authorization Error:", error);
          return null; // Ensure login fails safely
        }
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.token = user.token;
        token.two_factor = user.two_factor; // ✅ Ensure this updates correctly
      }

      if (trigger === "update") {
        // console.log("session", session);
        const { user } = session;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.two_factor = user.two_factor; // ✅ Ensure update trigger passes `two_factor`
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: typeof token.id === "string" ? token.id : "",
        first_name:
          typeof token.first_name === "string" ? token.first_name : "",
        last_name: typeof token.last_name === "string" ? token.last_name : "",
        email: typeof token.email === "string" ? token.email : "",
        token: typeof token.token === "string" ? token.token : "",
        two_factor:
          typeof token.two_factor === "boolean" ? token.two_factor : false, // ✅ Ensure it is properly passed
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export default authConfig;
