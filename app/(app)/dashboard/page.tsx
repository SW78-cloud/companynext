"use client";

import { useState } from 'react';
import { CompanySearch } from '@/components/dashboard/CompanySearch';
// import { CompanyReport } from '@/components/dashboard/CompanyReport'; // Kept for reference but hiding for new layout
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PenSquare, TrendingUp, Users, ShieldCheck, Activity, Search, Filter, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-navy-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of your market perception and risk signals.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        {selectedPeriod}
                    </Button>
                    <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                        <PenSquare className="w-4 h-4" />
                        Quick Action
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reputation Score</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-navy-900">8.4</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-green-600 font-medium">+2.1%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-navy-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Verified Reviews</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-navy-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-navy-900">124</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            12 pending verification
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Search Appearances</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-navy-900">1,203</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            High interest this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Risk Signals</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-navy-900">2</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            New CCMA cases flagged
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                {/* Main Chart / Themes Area (Span 4) */}
                <Card className="col-span-4 shadow-sm border-0 bg-white">
                    <CardHeader>
                        <CardTitle className="text-navy-900">Top Themes</CardTitle>
                        <CardDescription>
                            Most frequently mentioned topics in verified reviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Badge variant="secondary" className="px-3 py-1 bg-navy-100 text-navy-900 hover:bg-navy-200 cursor-pointer">
                                💼 Work-Life Balance (45)
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer border-orange-200">
                                💰 Compensation (32)
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 bg-navy-100 text-navy-900 hover:bg-navy-200 cursor-pointer">
                                🚀 Career Growth (28)
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer border-red-200">
                                ⏰ Overtime (15)
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 bg-navy-100 text-navy-900 hover:bg-navy-200 cursor-pointer">
                                🤝 Management (12)
                            </Badge>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 border border-dashed border-gray-200 flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
                            [Interactive Theme Heatmap Placeholder]
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity / Feed (Span 3) */}
                <Card className="col-span-3 shadow-sm border-0 bg-white">
                    <CardHeader>
                        <CardTitle className="text-navy-900">Recent Signals</CardTitle>
                        <CardDescription>
                            Latest verified public data points.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                                    <div className="h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center border border-navy-100 shrink-0">
                                        <ShieldCheck className="h-4 w-4 text-navy-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-navy-900">Verified Review Added</p>
                                        <p className="text-xs text-muted-foreground">
                                            A new rating for "Senior Engineer" was verified via placement match.
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Area Layout - Keeping the functionality but styling it */}
            <div className="p-6 bg-navy-900 rounded-xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-4">Research Warnings</h2>
                    <p className="text-navy-100 mb-6 max-w-2xl">
                        Search for other companies to benchmark your scores or check for red flags before engaging with new contract houses.
                    </p>
                    <div className="max-w-xl bg-white rounded-lg p-1">
                        <CompanySearch onSelect={(id) => console.log(id)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
