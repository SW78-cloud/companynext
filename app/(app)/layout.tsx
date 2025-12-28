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
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
