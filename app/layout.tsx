import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// Clerk removed
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CompanyNext - Transparent Company Insights',
    description: 'Discover company insights from public records and user reviews',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning>{children}</body>
        </html>
    );
}
