import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Company Next
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Transparent company insights for South Africa&apos;s workforce.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            <span>Built for South Africa</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/search" className="hover:text-foreground">Search</Link>
                            </li>
                            <li>
                                <Link href="/#how-it-works" className="hover:text-foreground">How it Works</Link>
                            </li>
                            <li>
                                <Link href="/sources" className="hover:text-foreground">Data Sources</Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-foreground">For Contractors</Link>
                            </li>
                            <li>
                                <Link href="/submit-review" className="hover:text-foreground">Submit Review</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4">Legal & Privacy</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-foreground">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/sources" className="hover:text-foreground">Sources & Limitations</Link>
                            </li>
                            <li>
                                <Link href="/sources" className="hover:text-foreground">Takedown Requests</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="mailto:support@companynext.co.za" className="hover:text-foreground">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/#faq" className="hover:text-foreground">FAQ</Link>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-foreground">Admin Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Company Next. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border">
                        <Scale className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground">
                            Company Next provides informational insights, not legal advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
