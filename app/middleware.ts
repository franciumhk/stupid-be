import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {
    // Get the session token
    const session = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Redirect to login if there is no session
    if (!session) {
      return NextResponse.redirect(new URL("api/auth/signin", request.url));
    }
  }

  // Continue the request for non-admin routes or if the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
