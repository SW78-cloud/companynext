import { notFound } from 'next/navigation';
import { MetricCard } from '@/components/metric-card';
import { ChartPlaceholder } from '@/components/chart-placeholder';
import { DataTable } from '@/components/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Calendar } from 'lucide-react';
import prisma from '@/lib/db';

async function getCompany(id: string) {
    const company = await prisma.company.findUnique({
        where: { id },
        include: {
            caseRecords: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
            reviews: {
                where: { status: 'APPROVED' },
                orderBy: { createdAt: 'desc' },
                take: 5,
            },
            _count: {
                select: {
                    caseRecords: true,
                    reviews: true,
                },
            },
        },
    });

    return company;
}

export default async function CompanyPage({ params }: { params: { id: string } }) {
    const company = await getCompany(params.id);

    if (!company) {
        notFound();
    }

    const caseColumns = [
        { key: 'caseRef', label: 'Case Reference' },
        { key: 'source', label: 'Source' },
        {
            key: 'year',
            label: 'Year',
            render: (item: any) => item.year || 'N/A',
        },
        {
            key: 'outcomeLabel',
            label: 'Outcome',
            render: (item: any) => item.outcomeLabel || 'Unknown',
        },
    ];

    return (
        <div className="container px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Company Header */}
                <div className="mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{company.legalName}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {company.cipcNumber && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        CIPC: {company.cipcNumber}
                                    </div>
                                )}
                                {company.industry && (
                                    <div className="flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        {company.industry}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Added {new Date(company.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <MetricCard
                        title="Total Case Records"
                        value={company._count.caseRecords}
                        description="Public legal cases"
                    />
                    <MetricCard
                        title="User Reviews"
                        value={company._count.reviews}
                        description="Approved reviews"
                    />
                    <MetricCard
                        title="Data Sources"
                        value={new Set(company.caseRecords.map((c) => c.source)).size}
                        description="Unique sources"
                    />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="cases">Legal Cases</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <ChartPlaceholder
                            title="Case Records Over Time"
                            description="Trend of legal cases by year"
                        />
                        <ChartPlaceholder
                            title="Case Outcomes Distribution"
                            description="Breakdown of case outcomes"
                            height={250}
                        />
                    </TabsContent>

                    <TabsContent value="cases">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Legal Cases</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={company.caseRecords}
                                    columns={caseColumns}
                                    emptyMessage="No case records found"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {company.reviews.length === 0 ? (
                                    <p className="text-center py-8 text-muted-foreground">
                                        No reviews yet. Be the first to review this company!
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {company.reviews.map((review) => (
                                            <div key={review.id} className="border-b pb-4 last:border-0">
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {review.roleType || 'Anonymous'} •{' '}
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                                {review.redactedText && (
                                                    <p className="text-sm">{review.redactedText}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
