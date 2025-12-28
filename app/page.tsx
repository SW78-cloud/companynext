import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Transparent Company Insights
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Make informed decisions with comprehensive data from public records, legal cases, and verified user reviews.
                        </p>
                        <div className="max-w-2xl mx-auto mb-12">
                            <SearchBar />
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button asChild size="lg">
                                <Link href="/search">
                                    <Search className="mr-2 h-4 w-4" />
                                    Browse Companies
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/sources">
                                    Learn More
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t bg-muted/40 py-16">
                    <div className="container px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Why CompanyNext?</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                                    <Search className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold mb-2">Comprehensive Data</h3>
                                <p className="text-sm text-muted-foreground">
                                    Access public records, legal cases, and user reviews all in one place.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                                <p className="text-sm text-muted-foreground">
                                    Analyze trends and patterns to make better business decisions.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold mb-2">Transparent & Ethical</h3>
                                <p className="text-sm text-muted-foreground">
                                    Only publicly available data. No scraping of gated sites or bypassing CAPTCHAs.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container px-4 py-16">
                    <div className="mx-auto max-w-3xl text-center rounded-2xl border bg-card p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-muted-foreground mb-6">
                            Search thousands of companies or contribute your own experience.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button asChild size="lg">
                                <Link href="/register">
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/submit-review">Submit a Review</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
