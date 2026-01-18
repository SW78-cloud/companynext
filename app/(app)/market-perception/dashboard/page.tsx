"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ShieldCheck, TrendingUp, Info } from 'lucide-react';

// Mock Data Types matching API response
interface ComparisonData {
    fairnessIndex: number;
    categories: Record<string, number>;
    confidence: number;
    topTags: { tag: string; count: number }[];
}

export default function MarketPerceptionDashboard() {
    const [data, setData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(true);

    // In a real app, we'd fetch this based on the user's org or selected view
    // For demo, we mock the fetch or hit the API if running
    useEffect(() => {
        // Placeholder fetch
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            // Mock Data
            setData({
                fairnessIndex: 78,
                categories: {
                    transparency: 4.2,
                    paymentDiscipline: 4.8,
                    support: 3.5,
                    onboarding: 4.0,
                    safety: 5.0
                },
                confidence: 0.85,
                topTags: [
                    { tag: "Great payment speed", count: 12 },
                    { tag: "Clear communication", count: 8 },
                    { tag: "Legacy tools", count: 5 }
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Market Perception & Risk Intelligence</h1>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-green-200">Verified Only</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-200">K-Anonymity Protected</span>
                </div>
                <p className="text-muted-foreground">
                    Aggregated insights from <strong>verified</strong> contractor feedback. Unverified or identifiable data is strictly excluded.
                </p>
            </div>

            <Tabs defaultValue="contract-house" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="contract-house">My Contract House</TabsTrigger>
                    <TabsTrigger value="client-risk">Client Risk Map</TabsTrigger>
                </TabsList>

                <TabsContent value="contract-house" className="space-y-4">
                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Fairness Index</CardTitle>
                                <ShieldCheck className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.fairnessIndex ?? '-'} / 100</div>
                                <p className="text-xs text-muted-foreground">High Confidence ({data ? Math.round(data.confidence * 100) : 0}%)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Feedback Volume</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.topTags.reduce((acc, t) => acc + t.count, 0) ?? 0}+</div>
                                <p className="text-xs text-muted-foreground">Verified submissions</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Radar Chart / Detailed Breakdown */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Category Performance</CardTitle>
                                <CardDescription>Average ratings (1-5 scale) across key dimensions.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/* Placeholder for Recharts Radar */}
                                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                                    <span className="text-muted-foreground">[Radar Chart Visualization]</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Tags */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Themes</CardTitle>
                                <CardDescription>What contractors are saying.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data?.topTags.map((t, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">{t.tag}</p>
                                            </div>
                                            <div className="font-bold">{t.count} mentions</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="client-risk">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Risk Map</CardTitle>
                            <CardDescription>Identify high-risk clients based on payment discipline, safety, and scope creep.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center p-8 bg-amber-50 rounded-md border border-amber-200">
                                <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
                                <span className="text-amber-800">
                                    Risk Map data is restricted to Contract House Admins only.
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
