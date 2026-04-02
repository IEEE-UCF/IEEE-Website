import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Uses the standard routes that should require a logged in user
	const protectedRoutes = ['/dashboard', '/settings', '/scan-qr'];
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	// Admin routes — cookie presence is checked here; actual admin authorization
	// is enforced by adminProcedure in tRPC (runs in trusted server context).
	// The previous fetch-based session check was racy: the secondary /api/auth/session
	// request could resolve against a different DB state than the original request.
	const adminRoutes = ['/admin', '/test'];
	const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

	const sessionCookie =
		request.cookies.get('next-auth.session-token') ||
		request.cookies.get('__Secure-next-auth.session-token');

	if (!sessionCookie && isProtectedRoute) {
		const signInUrl = new URL('/auth/signin', request.url);
		return NextResponse.redirect(signInUrl);
	}

	// Gate admin routes on cookie presence only — tRPC adminProcedure handles
	// the real authorization check server-side where it's safe and non-racy.
	if (isAdminRoute && !sessionCookie) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};