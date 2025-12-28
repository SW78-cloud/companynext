import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { MetricCard } from '@/components/metric-card';
import { ChartPlaceholder } from '@/components/chart-placeholder';
import { DataTable } from '@/components/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Calendar, Star } from 'lucide-react';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { GlassdoorAttribution } from '@/components/glassdoor-attribution';

interface CompanyData {
    id: string;
    legalName: string;
    cipcNumber: string | null;
    industry: string | null;
    createdAt: Date;
    glassdoorCache: any;
    reviewAggregate: any;
    caseRecords: any[];
    reviews: any[];
    _count: {
        caseRecords: number;
        reviews: number;
    };
}

async function getCompany(id: string): Promise<CompanyData | null> {
    const company = await (prisma.company.findUnique({
        where: { id },
        include: {
            glassdoorCache: true,
            reviewAggregate: true,
            caseRecords: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
            reviews: {
                where: { status: 'PUBLISHED' as any },
                include: {
                    user: {
                        select: { name: true } as any,
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            },
            _count: {
                select: {
                    caseRecords: true,
                    reviews: { where: { status: 'PUBLISHED' as any } },
                },
            },
        } as any,
    }) as any);

    return company as CompanyData | null;
}

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) {
        const { id } = await params;
        redirect(`/login?returnUrl=/company/${id}`);
    }

    const { id } = await params;
    const company = await getCompany(id);

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
                        {user && ['EMPLOYEE', 'CONTRACTOR', 'ADMIN'].includes(user.role) && (
                            <Link href={`/company/${company.id}/review`}>
                                <Button>Submit Review</Button>
                            </Link>
                        )}
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
                        description="Published reviews"
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
                        <TabsTrigger value="ratings">Ratings</TabsTrigger>
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

                    <TabsContent value="ratings" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Internal Ratings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Internal Labour Ratings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!(company as any).reviewAggregate || (company as any).reviewAggregate.totalPublished === 0 ? (
                                        <p className="text-muted-foreground text-sm py-4">No internal ratings yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Overall', value: (company as any).reviewAggregate.avgOverall },
                                                { label: 'Pay Fairness', value: (company as any).reviewAggregate.avgPayFairness },
                                                { label: 'Contract Fairness', value: (company as any).reviewAggregate.avgContractFairness },
                                                { label: 'Termination Risk', value: (company as any).reviewAggregate.avgTerminationRisk },
                                                { label: 'Payment Discipline', value: (company as any).reviewAggregate.avgPaymentDiscipline },
                                                { label: 'Management Integrity', value: (company as any).reviewAggregate.avgManagementIntegrity },
                                            ].map((rating) => (
                                                <div key={rating.label} className="flex justify-between items-center">
                                                    <span className="text-sm">{rating.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary"
                                                                style={{ width: `${(rating.value / 5) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold">{rating.value.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Glassdoor Ratings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        Glassdoor Summary
                                        <GlassdoorAttribution />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!(company as any).glassdoorCache ? (
                                        <p className="text-muted-foreground text-sm py-4">No Glassdoor data available.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                                                <span className="text-2xl font-bold">
                                                    {((company as any).glassdoorCache.data as any).overallRating || 'N/A'}
                                                </span>
                                                <span className="text-muted-foreground text-sm">
                                                    {((company as any).glassdoorCache.data as any).numberOfRatings || 0} reviews)
                                                </span>
                                            </div>
                                            {((company as any).glassdoorCache.data as any).featuredReview && (
                                                <div className="bg-muted p-3 rounded-lg text-sm italic">
                                                    &ldquo;{((company as any).glassdoorCache.data as any).featuredReview.pros?.substring(0, 150)}...&rdquo;
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
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
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-medium">
                                                        {review.isAnonymous ? 'Anonymous' : (review.user.name || 'Anonymous User')}
                                                    </span>
                                                    <Badge variant="outline" className="text-[10px] py-0">
                                                        Verified {review.employmentType === 'PERM' ? 'Permanent Employee' : 'Contractor'}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        • {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {review.title && (
                                                    <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                                                )}
                                                {review.body && (
                                                    <p className="text-sm text-muted-foreground">{review.body}</p>
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
