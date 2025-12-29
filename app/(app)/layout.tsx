import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        // If session exists (passed middleware) but user not found in DB, 
        // redirect to logout to clear the stale session and prevent redirect loop.
        redirect('/api/auth/logout');
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
