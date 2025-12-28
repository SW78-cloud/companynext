import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/search(.*)',
    '/company/(.*)',
    '/compare(.*)',
    '/sources(.*)',
    '/about(.*)',
    '/privacy(.*)',
    '/terms(.*)',
    '/login(.*)',
    '/register(.*)',
    '/api/companies/search(.*)',
    '/api/companies/(.*)/metrics(.*)',
    '/api/companies/(.*)/cases(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
    // Protect non-public routes
    if (!isPublicRoute(req)) {
        await auth.protect();
    }

    // Additional admin route protection will be handled in the page components
    // via role checking from the database
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
