import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasStaffCapability } from '@/lib/permissions';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Routes that just require a logged-in user
	const protectedRoutes = ['/dashboard', '/settings', '/scan-qr'];
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	// Capability-gated routes: reachable by admins, officers, or a member holding the
	// named granular permission. Checked before the admin routes (more specific).
	const capabilityRoutes: { prefix: string; capability: string }[] = [
		{ prefix: '/admin/photos', capability: 'manage_event_photos' },
		{ prefix: '/admin/resumes', capability: 'review_resumes' },
	];
	const capabilityRoute = capabilityRoutes.find((r) => pathname.startsWith(r.prefix));

	// /staff hub — reachable by admins, officers, or anyone with ≥1 granted capability.
	const isStaffRoute = pathname.startsWith('/staff');

	// Reachable by admins OR officers (no single capability gates it). Officers get a
	// read-only view + can toggle admin-delegated capabilities for regular members.
	const officerAdminRoutes = ['/admin/members'];
	const isOfficerAdminRoute = officerAdminRoutes.some((route) => pathname.startsWith(route));

	// Admin-only routes (everything else under /admin, plus /test)
	const adminRoutes = ['/admin', '/test'];
	const isAdminRoute =
		!capabilityRoute &&
		!isOfficerAdminRoute &&
		adminRoutes.some((route) => pathname.startsWith(route));

	const sessionCookie =
		request.cookies.get('next-auth.session-token') ||
		request.cookies.get('__Secure-next-auth.session-token');

	if (!sessionCookie && isProtectedRoute) {
		const signInUrl = new URL('/auth/signin', request.url);
		return NextResponse.redirect(signInUrl);
	}

	if (capabilityRoute || isAdminRoute || isStaffRoute || isOfficerAdminRoute) {
		// Not signed in → send to sign-in and come back here afterwards.
		const signIn = new URL('/auth/signin', request.url);
		signIn.searchParams.set('callbackUrl', pathname);
		// Signed in but not authorised → their own dashboard, not the marketing home.
		const noAccess = new URL('/dashboard', request.url);

		if (!sessionCookie) {
			return NextResponse.redirect(signIn);
		}

		try {
			const sessionUrl = new URL('/api/auth/session', request.url);
			const response = await fetch(sessionUrl, {
				headers: { cookie: request.headers.get('cookie') || '' },
			});

			if (!response.ok) {
				return NextResponse.redirect(signIn);
			}

			const session = await response.json();
			const user = session?.user;
			if (!user) {
				return NextResponse.redirect(signIn);
			}

			const perms: string[] = Array.isArray(user.permissions) ? user.permissions : [];
			let allowed: boolean;
			if (capabilityRoute) {
				allowed = Boolean(user.administrator || user.officerStatus || perms.includes(capabilityRoute.capability));
			} else if (isStaffRoute) {
				allowed = Boolean(user.administrator || user.officerStatus || hasStaffCapability(perms));
			} else if (isOfficerAdminRoute) {
				allowed = Boolean(user.administrator || user.officerStatus);
			} else {
				allowed = Boolean(user.administrator);
			}

			if (!allowed) {
				return NextResponse.redirect(noAccess);
			}
		} catch (error) {
			console.error('Middleware error:', error);
			return NextResponse.redirect(noAccess);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};