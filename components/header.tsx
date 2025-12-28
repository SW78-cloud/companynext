import Link from 'next/link';
import { SearchBar } from './search-bar';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export async function Header() {
    const user = await currentUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            CompanyNext
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/search"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Search
                        </Link>
                        <Link
                            href="/compare"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Compare
                        </Link>
                        <Link
                            href="/sources"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sources
                        </Link>
                    </nav>
                </div>

                <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/my-account"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                My Account
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile search */}
            <div className="container px-4 pb-4 lg:hidden">
                <SearchBar />
            </div>
        </header>
    );
}
