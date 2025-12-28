import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-3">CompanyNext</h3>
                        <p className="text-sm text-muted-foreground">
                            Transparent company insights from public records and user reviews.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/sources" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Sources & Limitations
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Search Companies
                                </Link>
                            </li>
                            <li>
                                <Link href="/submit-review" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Submit Review
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} CompanyNext. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
