import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

async function SearchResults({ query }: { query: string }) {
    if (!query) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Enter a search term to find companies
            </div>
        );
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/companies/search?q=${encodeURIComponent(query)}`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const data = await response.json();
        const companies = data.companies || [];

        if (companies.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    No companies found for &quot;{query}&quot;
                </div>
            );
        }

        return (
            <div className="grid gap-4">
                {companies.map((company: any) => (
                    <Link key={company.id} href={`/company/${company.id}`}>
                        <Card className="hover:border-primary transition-colors cursor-pointer">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{company.legalName}</CardTitle>
                                        {company.cipcNumber && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                CIPC: {company.cipcNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            {company.industry && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Industry: {company.industry}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    </Link>
                ))}
            </div>
        );
    } catch (error) {
        return (
            <div className="text-center py-12 text-destructive">
                Failed to load search results. Please try again.
            </div>
        );
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) {
        const { q } = await searchParams;
        const queryParams = q ? `?q=${encodeURIComponent(q)}` : '';
        redirect(`/login?returnUrl=/search${queryParams}`);
    }

    const { q } = await searchParams;
    const query = q || '';

    return (
        <div className="container px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Search Companies</h1>

                <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
                    <SearchResults query={query} />
                </Suspense>
            </div>
        </div>
    );
}
