import { handlers } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;

console.log("NextAuth secret is set", !!process.env.NEXTAUTH_SECRET);
