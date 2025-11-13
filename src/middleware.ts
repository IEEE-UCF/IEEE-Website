import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // requires authentication!!!
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // if not authenticated and trying to access protected route
  if (!token && isProtectedRoute) {
    const signInUrl = new URL("/auth/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // if real
  if (token) {
    // pls dont get access to sign in, instead we pass through to others
    if (pathname === "/auth/signin") {
      // if they have good member id, push to db, otherwise reg
      if (token.memberId) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/auth/register", request.url));
      }
    }

    // require member profile
    const protectedRoutes = ["/dashboard"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && !token.memberId) {
      return NextResponse.redirect(new URL("/auth/register", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};