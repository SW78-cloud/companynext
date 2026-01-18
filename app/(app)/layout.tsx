import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { DebugSessionBanner } from '@/components/debug-session-banner'; // Keeping this as requested

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Desktop */}
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 md:pl-64 flex flex-col">
                <AppHeader />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            <DebugSessionBanner />
        </div>
    );
}
