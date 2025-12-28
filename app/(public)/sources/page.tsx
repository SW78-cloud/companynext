import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SourcesBadge, CoverageBadge } from '@/components/sources-badge';
import { CoveragePanel, InfoCallout } from '@/components/coverage-panel';
import { ReportIssueDialog } from '@/components/report-issue-dialog';
import {
    Scale,
    Users,
    Newspaper,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Shield,
    BarChart3,
    Search
} from 'lucide-react';

export default function SourcesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 bg-muted/5">
                <div className="container px-4 py-16 max-w-4xl mx-auto">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Transparency First</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Sources & Limitations</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            We believe in complete transparency about where our data comes from, how we verify it, and exactly what we can—and cannot—show you.
                        </p>

                        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900">
                            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <p>
                                <strong>Important Disclaimer:</strong> Company Next provides informational insights based on public records and user submissions. We do not provide legal advice. All data should be treated as signals for further due diligence, not as definitive verdicts on a company&apos;s legal standing or workplace culture.
                            </p>
                        </div>
                    </div>

                    {/* Section A: What We Use */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Data Sources
                        </h2>

                        <div className="grid gap-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg">
                                                <Scale className="h-5 w-5 text-blue-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Public Legal Decisions</CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1">Foundational Layer</p>
                                            </div>
                                        </div>
                                        <SourcesBadge type="SAFLII" label="SAFLII Database" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        We index publicly available labour decisions from the <span className="font-medium text-foreground">Southern African Legal Information Institute (SAFLII)</span>. This provides an objective baseline of labour relations history.
                                    </p>
                                    <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>CCMA Arbitration Awards</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Labour Court Judgments</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Labour Appeal Court Judgments</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-50 p-2 rounded-lg">
                                                <Users className="h-5 w-5 text-amber-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">User Submissions</CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1">Community Layer</p>
                                            </div>
                                        </div>
                                        <SourcesBadge type="USER" label="Verified Users" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Verified users contribute first-hand workforce experiences. All submissions are anonymised to protect identities while preserving the insight.
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
                                        <li>Workplace culture reviews and ratings</li>
                                        <li>Contractor placement records (Agency, Client, Duration)</li>
                                        <li>Interview experiences and salary insights</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                <Newspaper className="h-5 w-5 text-slate-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Admin-Curated References</CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1">Verification Layer</p>
                                            </div>
                                        </div>
                                        <SourcesBadge type="VERIFIED" label="Public URLs" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Our team manually verifies and links to trusted public information sources, such as official press releases, major news outlets, and regulatory filings. We link out to these sources rather than hosting them.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section B: What We Do NOT Do */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Ethical Constraints
                        </h2>

                        <Card className="border-red-100 bg-red-50/10">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-red-700">
                                    <Shield className="h-5 w-5" />
                                    <CardTitle>What We Will Never Do</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-4">
                                <div className="flex gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                                    <div className="text-sm">
                                        <strong className="block mb-1">No Gated Scraping</strong>
                                        <span className="text-muted-foreground">We never bypass logins, paywalls, or authentication to access data.</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                                    <div className="text-sm">
                                        <strong className="block mb-1">No CAPTCHA Bypassing</strong>
                                        <span className="text-muted-foreground">We respect anti-bot measures and only collect data intended for public access.</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                                    <div className="text-sm">
                                        <strong className="block mb-1">No Unauthorized Scraping</strong>
                                        <span className="text-muted-foreground">We do not scrape sites like Glassdoor that prohibit automated collection.</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                                    <div className="text-sm">
                                        <strong className="block mb-1">No Copyright Infringement</strong>
                                        <span className="text-muted-foreground">We link out to third-party content unless we have a specific license.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Section C: Coverage & Limitations */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Coverage & Limitations
                        </h2>

                        <div className="grid gap-6">
                            <CoveragePanel
                                title="Public Record Availability"
                                level="PARTIAL"
                                items={[
                                    {
                                        question: "Are all labour disputes published?",
                                        answer: "No. Many disputes are settled privately, withdrawn, or resolved internally before reaching a public forum. Published decisions represent only the 'tip of the iceberg' of labour relations."
                                    },
                                    {
                                        question: "Is the data real-time?",
                                        answer: "No. There is often a significant time lag (months or even years) between a judgment being delivered and it being cleaned, anonymised (by the court), and published online."
                                    }
                                ]}
                            />

                            <CoveragePanel
                                title="Data Extraction & Accuracy"
                                level="HIGH"
                                items={[
                                    {
                                        question: "How do you determine case outcomes?",
                                        answer: "We use automated text analysis to classify outcomes (e.g., 'Dismissed', 'Upheld'). If the text is ambiguous or complex, we classify the outcome as 'Unknown' rather than guessing."
                                    },
                                    {
                                        question: "How reliable are the counts?",
                                        answer: "Counts are legally accurate based on 'discoverable' documents. However, a count of 0 does not mean zero disputes occurred, only that zero were found in the public record."
                                    }
                                ]}
                            />

                            <CoveragePanel
                                title="Entity Matching"
                                icon={<Search className="h-4 w-4" />}
                                alertMessage="Matching confidence varies by company name uniqueness."
                                items={[
                                    {
                                        question: "How do you match cases to companies?",
                                        answer: "We match based on legal entity names and CIPC numbers where available. However, companies often trade under different names or have complex group structures."
                                    },
                                    {
                                        question: "What about trading names and aliases?",
                                        answer: "We attempt to track 'Doing Business As' names, but matches against common names (e.g., 'Prestige Cleaning') may have lower confidence. We reflect this with a confidence score on the company profile."
                                    }
                                ]}
                            />
                        </div>
                    </section>

                    {/* Section D: Interpreting Metrics */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            How to Interpret Metrics
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCallout title="Signals, Not Verdicts">
                                <p>
                                    High dispute counts are a <strong>signal</strong> to investigate further, not a definitive verdict of a &quot;bad&quot; employer. Large companies naturally have more cases due to sheer workforce size.
                                </p>
                            </InfoCallout>

                            <InfoCallout title="Look for Patterns">
                                <p>
                                    An isolated case from 5 years ago is less relevant than a cluster of recent cases regarding similar issues (e.g., &quot;Unfair Dismissal&quot;). Trends matter more than absolute numbers.
                                </p>
                            </InfoCallout>
                        </div>

                        <div className="mt-6 grid gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-base">Context Matters</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex gap-2">
                                            <span className="font-semibold text-foreground min-w-[100px]">Time Windows:</span>
                                            <span>We focus on the last 5-10 years to ensure relevance. Older data is retained for historical context but weighted less heavily.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-semibold text-foreground min-w-[100px]">Sample Sizes:</span>
                                            <span>For contractor ratings, we do not engage in &quot;naming and shaming&quot; with single data points. Aggregates are only shown once we hit privacy-preserving thresholds (e.g., 5+ reviews).</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section E: Report an Issue */}
                    <section className="bg-muted/30 p-8 rounded-xl border text-center">
                        <h2 className="text-2xl font-bold mb-3">See something incorrect?</h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Data accuracy is a team effort. If you spot a mismatch, incorrect company link, or duplicate entry, please let us know immediately.
                        </p>
                        <ReportIssueDialog />
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
