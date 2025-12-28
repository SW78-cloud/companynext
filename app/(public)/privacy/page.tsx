import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, UserX, Database, FileCheck } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <div className="container px-4 py-16 max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4">Our Privacy Promise</h1>
                        <p className="text-xl text-muted-foreground">
                            Privacy by design. Your identity and personal information are protected at every step.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Core Principles */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Core Privacy Principles</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <UserX className="h-6 w-6 text-primary" />
                                            <CardTitle>Never Publish Identity</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            We never publish personal identity information. All reviews and submissions are anonymised before publication.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Eye className="h-6 w-6 text-primary" />
                                            <CardTitle>Redact Sensitive Info</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            We automatically redact sensitive information from all text, including names, contact details, and identifying characteristics.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Database className="h-6 w-6 text-primary" />
                                            <CardTitle>Aggregated Reporting</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Vendor/client reporting is aggregated and only shown once sample size thresholds are met to prevent identification.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-6 w-6 text-primary" />
                                            <CardTitle>POPIA Compliant</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Our platform is designed to comply with South Africa&apos;s Protection of Personal Information Act (POPIA).
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* What We Collect */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">What We Collect</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Account Information</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Email address, password (encrypted), and role type (Employee/Contractor). We handle your credentials securely using industry-standard encryption (bcrypt).
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Review & Submission Data</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Company ratings, anonymised text reviews, and for contractors: vendor/client placement information. All personally identifying information is stripped before storage.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Usage Data</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Search queries, pages viewed, and interaction patterns to improve our service. This data is aggregated and never linked to your identity in public reports.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* What We Don't Collect */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">What We Don&apos;t Collect</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✗</span>
                                            <span>Real names or identity documents</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✗</span>
                                            <span>Physical addresses or phone numbers</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✗</span>
                                            <span>Financial information (no payments required)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✗</span>
                                            <span>Social media profiles or connections</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✗</span>
                                            <span>Biometric data or health information</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>

                        {/* How We Protect Your Data */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">How We Protect Your Data</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-primary" />
                                                Encryption
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                All data is encrypted in transit (TLS) and at rest. Passwords are hashed using industry-standard algorithms.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <FileCheck className="h-4 w-4 text-primary" />
                                                Access Controls
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Strict role-based access control ensures only authorized personnel can access sensitive data, and all access is logged.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <Database className="h-4 w-4 text-primary" />
                                                Data Minimization
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                We only collect and retain data necessary for our service. Personal data is automatically purged when no longer needed.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Your Rights */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Under POPIA and general privacy principles, you have the right to:
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span><strong>Access</strong> your personal data we hold</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span><strong>Correct</strong> inaccurate information</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span><strong>Delete</strong> your account and associated data</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span><strong>Export</strong> your data in a portable format</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span><strong>Object</strong> to processing of your data</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span><strong>Withdraw consent</strong> at any time</span>
                                        </li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        To exercise any of these rights, contact us at privacy@companynext.co.za
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Contractor-Specific Privacy */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Contractor-Specific Privacy</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        For contractors who enter vendor and client placement information:
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Your individual placement details are never shown publicly</li>
                                        <li>• Metrics are only displayed in aggregate (minimum 5 placements)</li>
                                        <li>• Vendor and client names are shown, but not linked to individual contractors</li>
                                        <li>• Early termination data is anonymised and aggregated</li>
                                        <li>• You can delete your placement history at any time</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Data Retention */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p>
                                            <strong>Account data:</strong> Retained while your account is active, deleted within 30 days of account closure
                                        </p>
                                        <p>
                                            <strong>Reviews:</strong> Anonymised reviews remain published after account deletion (no link to your identity)
                                        </p>
                                        <p>
                                            <strong>Audit logs:</strong> Retained for 12 months for security and compliance purposes
                                        </p>
                                        <p>
                                            <strong>Aggregated metrics:</strong> Remain in aggregate form (cannot be traced back to individuals)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Questions or Concerns?</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        If you have any questions about our privacy practices or wish to exercise your rights:
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Email:</strong> privacy@companynext.co.za</p>
                                        <p><strong>Data Protection Officer:</strong> dpo@companynext.co.za</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
