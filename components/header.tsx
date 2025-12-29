import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { getCurrentUser } from '@/lib/auth';
import { UserMenu } from './user-menu';

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Company Next
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            How it works
                        </Link>
                        <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Company profiles
                        </Link>
                        <Link href="/sources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Sources & Limitations
                        </Link>
                    </nav>
                </div>

                <div className="flex-1 max-w-sm mx-4 hidden lg:block">
                    <SearchBar small />
                </div>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Button variant="ghost" asChild size="sm">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/onboarding">Get Started</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="hidden sm:inline-flex" size="sm">
                                <Link href="/submit-review">Write a Review</Link>
                            </Button>
                            <UserMenu user={user} />
                        </>
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
