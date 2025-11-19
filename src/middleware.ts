import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Uses the standard routes that should require a logged in user
	const protectedRoutes = ["/dashboard", "/settings", "/scan-qr"];
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	// Admin routes protected by admin permissions
	// So far set to do /admin and /test
	const adminRoutes = ["/admin", "/test"];
	const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

	const sessionCookie = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");

	if (!sessionCookie && isProtectedRoute) {
		const signInUrl = new URL("/auth/signin", request.url);
		return NextResponse.redirect(signInUrl);
	}

	if (isAdminRoute) {
		if (!sessionCookie) {
			const homeUrl = new URL("/", request.url);
			return NextResponse.redirect(homeUrl);
		}

		try {
			const sessionUrl = new URL("/api/auth/session", request.url);
			const response = await fetch(sessionUrl, {
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			});

			if (!response.ok) {
				const homeUrl = new URL("/", request.url);
				return NextResponse.redirect(homeUrl);
			}

			const session = await response.json();

			if (Object.keys(session).length === 0 || !session.user?.administrator) {
				const homeUrl = new URL("/", request.url);
				return NextResponse.redirect(homeUrl);
			}
		} catch (error) {
			console.error("Middleware error:", error);
			const homeUrl = new URL("/", request.url);
			return NextResponse.redirect(homeUrl);
		}
	}

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};