import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Redirect to /auth/login if the user is not authenticated
  if (!req.auth) {
    const loginUrl = new URL("/auth/login", req.url);
    return Response.redirect(loginUrl);
  }
});

// Protect the root path (`/`) and `/account/:path*`
export const config = {
  matcher: ["/", "/account/:path*"],
};
