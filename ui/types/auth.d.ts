import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

// ✅ Extend the User type to include first_name & last_name
declare module "next-auth" {
  interface User extends DefaultUser {
    first_name?: string;
    last_name?: string;
    token?: string;
    two_factor?: boolean;
  }

  interface Session {
    user: {
      id: string;
      first_name?: string;
      last_name?: string;
      email: string;
      token?: string;
      two_factor?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
    token?: string;
    two_factor?: boolean;
  }
}
