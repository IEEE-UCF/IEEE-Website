import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	if (process.env.NODE_ENV === 'production') {
		return new Response('Not allowed in production', { status: 403 });
	}

	const url = new URL('/dashboard', request.url);
	const response = NextResponse.redirect(url);

	// Set session token globally on path '/' so both /dashboard and /api/auth/session receive it
	response.cookies.set('next-auth.session-token', 'e8e8199a-4aa4-4027-a623-8665584daecf', {
		path: '/',
		httpOnly: true,
		maxAge: 30 * 24 * 60 * 60, // 30 days
		sameSite: 'lax',
	});

	return response;
}
