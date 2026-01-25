import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token');
    console.log('Token:', token);
    const path = request.nextUrl.pathname;

    // Protected routes
    if (path.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Auth routes (redirect to dashboard if already logged in)
    if (path === '/login' || path.startsWith('/register')) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register/:path*'],
};
