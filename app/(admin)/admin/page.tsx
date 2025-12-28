import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/metric-card';
import { Users, Building2, FileText, Database } from 'lucide-react';
import prisma from '@/lib/db';

async function getAdminStats() {
    const [userCount, companyCount, reviewCount, caseCount] = await Promise.all([
        prisma.user.count(),
        prisma.company.count(),
        prisma.review.count(),
        prisma.caseRecord.count(),
    ]);

    return { userCount, companyCount, reviewCount, caseCount };
}

export default async function AdminPage() {
    const stats = await getAdminStats();

    return (
        <div className="container px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <MetricCard
                        title="Total Users"
                        value={stats.userCount}
                        description="Registered users"
                    />
                    <MetricCard
                        title="Companies"
                        value={stats.companyCount}
                        description="In database"
                    />
                    <MetricCard
                        title="Reviews"
                        value={stats.reviewCount}
                        description="All statuses"
                    />
                    <MetricCard
                        title="Case Records"
                        value={stats.caseCount}
                        description="Legal cases"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-primary" />
                                <CardTitle>User Management</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage user accounts, roles, and permissions.
                            </p>
                            <div className="text-sm text-muted-foreground">
                                Feature coming soon
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <FileText className="h-6 w-6 text-primary" />
                                <CardTitle>Review Moderation</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Approve or reject pending user reviews.
                            </p>
                            <div className="text-sm text-muted-foreground">
                                Feature coming soon
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Building2 className="h-6 w-6 text-primary" />
                                <CardTitle>Company Management</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add, edit, or remove company records.
                            </p>
                            <div className="text-sm text-muted-foreground">
                                Feature coming soon
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Database className="h-6 w-6 text-primary" />
                                <CardTitle>Data Ingestion</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Monitor background jobs and data imports.
                            </p>
                            <div className="text-sm text-muted-foreground">
                                Feature coming soon
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
