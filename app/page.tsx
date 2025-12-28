import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Shield,
    Eye,
    Link as LinkIcon,
    Unlock,
    BarChart3,
    Scale,
    TrendingUp,
    Users,
    GitCompare,
    FileText,
    Search,
    CheckCircle2,
    Building2,
    UserCheck,
    Clock,
    ChevronRight
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
                    <div className="container px-4">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                                Know your next company—
                                <br />
                                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    before you resign.
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                                Company Next gives South Africans a clearer view of workplace culture and labour-risk signals using publicly available decisions and anonymised workforce insights.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto mb-8">
                                <SearchBar />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Search by company name, trading name, or CIPC number
                                </p>
                            </div>

                            {/* Hero CTAs */}
                            <div className="flex flex-wrap gap-4 justify-center mb-12">
                                <Button asChild size="lg">
                                    <Link href="/search">
                                        <Search className="mr-2 h-4 w-4" />
                                        Search Companies
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/search">
                                        Browse Insights
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 border">
                                    <Shield className="h-6 w-6 text-primary" />
                                    <p className="text-xs font-medium text-center">POPIA-aligned privacy</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 border">
                                    <Eye className="h-6 w-6 text-primary" />
                                    <p className="text-xs font-medium text-center">Identity masked on reviews</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 border">
                                    <LinkIcon className="h-6 w-6 text-primary" />
                                    <p className="text-xs font-medium text-center">Sources linked for verification</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 border">
                                    <Unlock className="h-6 w-6 text-primary" />
                                    <p className="text-xs font-medium text-center">No paywall for employees</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You'll See - Feature Grid */}
                <section className="py-20 bg-background">
                    <div className="container px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">What you&apos;ll see</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Comprehensive insights to help you make informed career decisions
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <BarChart3 className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">Company Culture Snapshot</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Leadership, fairness, support, workload, and growth signals from verified reviews
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Scale className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">CCMA / Labour Court Signals</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Public decisions indexed with source links to SAFLII and official records
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">Outcome Mix</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Won/lost/unknown outcomes shown only when verifiable from public records
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">Contractor Stability</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Early terminations and renewals, aggregated from anonymised placement records
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <GitCompare className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">Compare Companies</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Side-by-side insights to help you evaluate multiple opportunities
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">Evidence & Sources</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Transparent coverage and limitations clearly labeled for every data point
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 bg-muted/40">
                    <div className="container px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">How it works</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Three simple steps to make better career decisions
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                                        1
                                    </div>
                                    <h3 className="font-semibold mb-2 text-lg">Search a company</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enter a company name, trading name, or CIPC number
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                                        2
                                    </div>
                                    <h3 className="font-semibold mb-2 text-lg">View verified records</h3>
                                    <p className="text-sm text-muted-foreground">
                                        See public decisions and aggregated workforce signals
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                                        3
                                    </div>
                                    <h3 className="font-semibold mb-2 text-lg">Decide with confidence</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Compare companies and make informed career moves
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                                <p className="text-sm text-center text-amber-900 dark:text-amber-100">
                                    <strong>Important:</strong> Not all labour matters are published. We show what can be verified and label coverage clearly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Sources & Limitations */}
                <section className="py-20 bg-background">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">Data Sources & Limitations</h2>
                                <p className="text-muted-foreground">
                                    Transparency is core to our mission. Here&apos;s exactly where our data comes from.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">SAFLII Public Decisions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            CCMA and Labour Court decisions where publicly available
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">User Submissions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Contractor placements and reviews, anonymised and moderated
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Public References</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Admin-curated news links and official statements
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="p-6 rounded-lg border bg-card">
                                <h3 className="font-semibold mb-4">Important Constraints</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>We do not scrape gated sites or bypass CAPTCHAs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>For sites without usable public APIs (e.g., Glassdoor), we provide link-out only unless licensed access is obtained</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Coverage varies by company and jurisdiction—we clearly label what&apos;s available</span>
                                    </li>
                                </ul>
                                <div className="mt-6">
                                    <Button asChild variant="outline">
                                        <Link href="/sources">
                                            Read Full Sources & Limitations
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy by Design */}
                <section className="py-20 bg-muted/40">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">Privacy by design</h2>
                                <p className="text-muted-foreground">
                                    Your identity and personal information are protected at every step
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                        <Eye className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Never publish identity</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We never publish personal identity information
                                    </p>
                                </div>

                                <div className="text-center p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Redact sensitive info</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We redact sensitive information from all text
                                    </p>
                                </div>

                                <div className="text-center p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Aggregated reporting</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Metrics shown only once sample size thresholds are met
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <Button asChild size="lg">
                                    <Link href="/privacy">
                                        Read our Privacy Promise
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Audience Split */}
                <section className="py-20 bg-background">
                    <div className="container px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Built for your career path</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Whether you&apos;re a permanent employee or contractor, Company Next provides the insights you need
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building2 className="h-8 w-8 text-primary" />
                                        <CardTitle className="text-xl">For Employees</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Culture signals from verified reviews</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Public labour decisions and outcomes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Side-by-side company comparisons</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Free access, no paywall</span>
                                        </li>
                                    </ul>
                                    <Button asChild className="w-full">
                                        <Link href="/register">
                                            Join as Employee (Free)
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <UserCheck className="h-8 w-8 text-primary" />
                                        <CardTitle className="text-xl">For Contractors</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Contractor stability metrics</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Early termination and renewal rates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Vendor and client insights</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Anonymised placement tracking</span>
                                        </li>
                                    </ul>
                                    <Button asChild className="w-full">
                                        <Link href="/register">
                                            Join as Contractor (Free)
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="py-16 bg-muted/40">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                                <span className="text-2xl">🇿🇦</span>
                                <span className="font-semibold">Built for South Africa</span>
                            </div>
                            <p className="text-muted-foreground mb-8">
                                Company Next is designed specifically for the South African labour market, with local data sources and compliance with POPIA regulations.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                                <div className="p-4 rounded-lg border bg-background/50">
                                    <p className="font-medium mb-1">Future partnerships</p>
                                    <p className="text-xs">Worker advocacy groups</p>
                                </div>
                                <div className="p-4 rounded-lg border bg-background/50">
                                    <p className="font-medium mb-1">Future partnerships</p>
                                    <p className="text-xs">Legal partners</p>
                                </div>
                                <div className="p-4 rounded-lg border bg-background/50">
                                    <p className="font-medium mb-1">Future partnerships</p>
                                    <p className="text-xs">Research partners</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-20 bg-background">
                    <div className="container px-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Is this free?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Yes. Company Next is free for employees and contractors. We believe workplace transparency should be accessible to everyone making career decisions.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">How do you get CCMA/Labour Court information?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            We index publicly available decisions from SAFLII (Southern African Legal Information Institute) and other official public sources. We only show what is already in the public domain.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Why might counts look lower than expected?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Not all labour disputes result in published decisions. Many are settled privately, withdrawn, or handled through internal processes. We only show verified public records and clearly label coverage limitations.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">How do you protect anonymity?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            We never publish personal identity. All user submissions are anonymised, sensitive information is redacted, and contractor metrics are only shown in aggregate once minimum sample sizes are met.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Can companies respond?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Yes. Companies can claim their profile and provide context or responses to reviews. All responses are clearly labeled as coming from the company.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">What&apos;s your moderation policy?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            All user submissions are reviewed before publication. We remove personal attacks, unverifiable claims, and content that violates our community guidelines. Our goal is factual, helpful information.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
                    <div className="container px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Make your next move with clearer information
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Join thousands of South Africans making better career decisions
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button asChild size="lg">
                                    <Link href="/search">
                                        <Search className="mr-2 h-4 w-4" />
                                        Search a Company
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/register">
                                        Create a Free Account
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
