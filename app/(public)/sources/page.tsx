import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Database, Users, Shield } from 'lucide-react';

export default function SourcesPage() {
    return (
        <div className="container px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Sources & Limitations</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Understanding where our data comes from and what it means.
                </p>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Database className="h-6 w-6 text-primary" />
                                <CardTitle>Data Sources</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Public Legal Records</h3>
                                <p className="text-sm text-muted-foreground">
                                    We collect data from publicly available legal databases including CCMA (Commission for Conciliation, Mediation and Arbitration), Labour Courts, and High Courts in South Africa. All case records are sourced from official government websites and public court records.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">User-Submitted Reviews</h3>
                                <p className="text-sm text-muted-foreground">
                                    Reviews are submitted by verified users who have worked at or contracted with the companies. All reviews are moderated before publication to ensure they meet our community guidelines.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Company Information</h3>
                                <p className="text-sm text-muted-foreground">
                                    Basic company information such as legal names and CIPC numbers are sourced from the Companies and Intellectual Property Commission (CIPC) public database.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                                <CardTitle>Important Limitations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Data Completeness</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our database reflects only publicly available information. Not all legal cases or company activities are public record, so our data may not represent the complete picture of a company&apos;s history.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Timeliness</h3>
                                <p className="text-sm text-muted-foreground">
                                    While we strive to keep our data current, there may be delays between when information becomes public and when it appears in our database. Always verify critical information with official sources.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Interpretation</h3>
                                <p className="text-sm text-muted-foreground">
                                    The presence of legal cases does not necessarily indicate wrongdoing. Many cases are dismissed, settled, or ruled in favor of the company. Always review the case details and outcomes before drawing conclusions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Shield className="h-6 w-6 text-green-600" />
                                <CardTitle>Ethical Data Collection</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">No Scraping of Gated Sites</h3>
                                <p className="text-sm text-muted-foreground">
                                    We do not scrape data from password-protected sites, bypass CAPTCHAs, or access any information that requires authentication. All data is collected from publicly accessible sources only.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Respect for Privacy</h3>
                                <p className="text-sm text-muted-foreground">
                                    Personal information is redacted from case records and reviews. We only display information that is already in the public domain or has been voluntarily submitted by users.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Compliance</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our data collection practices comply with South African data protection laws and respect the terms of service of all source websites.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-blue-600" />
                                <CardTitle>How to Use This Data</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                <li>Use as one of many factors in your research and decision-making</li>
                                <li>Verify important information with official sources</li>
                                <li>Consider the context and outcomes of legal cases</li>
                                <li>Read multiple reviews to get a balanced perspective</li>
                                <li>Contact companies directly for clarification on specific issues</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
