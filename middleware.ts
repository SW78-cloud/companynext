import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
    const protectedRoutes = ['/my-account', '/submit-review', '/admin', '/settings'];
    const path = request.nextUrl.pathname;

    const isProtected = protectedRoutes.some((route) => path.startsWith(route));

    if (isProtected) {
        const cookie = request.cookies.get('session')?.value;
        const session = cookie ? await decrypt(cookie) : null;

        if (!session?.userId) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', path);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
