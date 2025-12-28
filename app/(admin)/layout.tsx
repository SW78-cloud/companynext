import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, UserRole } from '@/lib/rbac';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    if (!hasPermission(user.role as UserRole, 'view:admin')) {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
