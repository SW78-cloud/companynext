import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';
import { getSessionUser } from '@/lib/auth';
// Onboarding constants to avoid Edge Runtime issues with Prisma enums
const ONBOARDING_COMPLETE = 'COMPLETE';

// Public routes that don't require authentication
const publicRoutes = [
    '/register',
    '/login',
    '/privacy',
    '/sources',
    '/terms',
    '/onboarding', // Allow onboarding for guest entry
    '/', // Allow landing page
];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Skip middleware for API routes, static files, and Next.js internals
    if (
        path.startsWith('/api') ||
        path.startsWith('/_next') ||
        path.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // Check if route is public
    const isPublicRoute = publicRoutes.some((route) => {
        if (route.endsWith('/')) {
            return path.startsWith(route);
        }
        return path === route || path.startsWith(route + '/');
    });

    // Get session
    const cookie = request.cookies.get('session')?.value;
    const session = cookie ? await decrypt(cookie) : null;
    const isAuthenticated = !!session?.userId;

    // 1. If user is not authenticated -> allow only public routes
    if (!isAuthenticated) {
        if (isPublicRoute) {
            return NextResponse.next();
        }
        // Redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', path);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If authenticated and emailVerified=false -> redirect to /verify-email 
    // BUT allow /logout and public routes (except /onboarding which requires verification for step 2)
    if (!session?.emailVerified) {
        if (path === '/verify-email' || path === '/logout') {
            return NextResponse.next();
        }
        // Explicitly block /onboarding for unverified users so they are forced to verify first
        if (path.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/verify-email', request.url));
        }
        // Allow other public routes (like landing page, privacy policy)
        if (isPublicRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // If verified but on verify-email, move on
    if (path === '/verify-email') {
        if (session.onboardingStatus !== ONBOARDING_COMPLETE) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. If authenticated and emailVerified=true and onboardingStatus != COMPLETE -> redirect to /onboarding (except if already on /onboarding or /logout)
    if (session.onboardingStatus !== ONBOARDING_COMPLETE) {
        if (path === '/onboarding' || path === '/logout') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // 4. If authenticated and verified and onboarding complete -> allow app routes, but redirect from onboarding/login/register to home
    if (path === '/onboarding' || path === '/login' || path === '/register') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
