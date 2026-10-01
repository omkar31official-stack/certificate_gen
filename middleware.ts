import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Optional: add any custom logging or routing here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only the allowed admin email can access protected routes
        return token?.email === "projectom2820@gmail.com";
      },
    },
  }
);

export const config = {
  // Match any route starting with /admin, except /admin/login
  matcher: ["/admin/((?!login).*)", "/api/admin/:path*"],
};
