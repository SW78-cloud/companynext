import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

import { DebugSessionBanner } from '@/components/debug-session-banner';

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    // Check for stale session: If a session cookie exists but user is not found in DB
    const cookieStore = await cookies();
    const hasSession = cookieStore.has('session');

    if (hasSession && !user) {
        // Redirect to logout to clear the stale session and prevent redirect loop/errors
        redirect('/api/auth/logout');
    }

    // Note: If !hasSession && !user, it's a guest accessing a public route (like /onboarding).
    // Middleware handles protecting private routes, so we don't need to force redirect here.

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <DebugSessionBanner />
        </div>
    );
}
