"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Gavel, Scale, ThumbsDown, ThumbsUp } from 'lucide-react';

interface CompanyReportProps {
    companyId: string;
}

export function CompanyReport({ companyId }: CompanyReportProps) {
    // Mock data - replace with data fetching based on companyId
    const data = {
        name: "Acme Holdings Pty Ltd",
        score: 3.8,
        reviewCount: 42,
        ccmaCases: { lodged: 12, won: 8, lost: 2, settled: 2 },
        highCourtCases: 3,
        redFlags: ["High Turnover", "Management Issues", "Late Payments"],
        topTags: ["Flexible Hours", "Good Office"],
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Score */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl">{data.name}</CardTitle>
                            <p className="text-muted-foreground text-sm">Technology • Cape Town</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-primary">{data.score}</div>
                            <div className="text-xs text-muted-foreground">based on {data.reviewCount} reviews</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mt-2">
                        {data.topTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                                <ThumbsUp className="w-3 h-3" /> {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CCMA Cases Chart Area */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gavel className="w-5 h-5 text-orange-500" />
                            CCMA Cases
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Simple Bar Visualization */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Lodged</span>
                                    <span className="font-semibold">{data.ccmaCases.lodged}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-full" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Won (Employee)</span>
                                        <span className="font-semibold">{data.ccmaCases.won}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${(data.ccmaCases.won / data.ccmaCases.lodged) * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Lost (Employee)</span>
                                        <span className="font-semibold">{data.ccmaCases.lost}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${(data.ccmaCases.lost / data.ccmaCases.lodged) * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Settled</span>
                                        <span className="font-semibold">{data.ccmaCases.settled}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500" style={{ width: `${(data.ccmaCases.settled / data.ccmaCases.lodged) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Red Flags & High Court */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Red Flags
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {data.redFlags.map(flag => (
                                    <Badge key={flag} variant="destructive" className="gap-1 px-3 py-1">
                                        <ThumbsDown className="w-3 h-3" /> {flag}
                                    </Badge>
                                ))}
                                {data.redFlags.length === 0 && <span className="text-muted-foreground text-sm">No major red flags reported.</span>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="w-5 h-5 text-indigo-500" />
                                High Court Cases
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <span className="text-5xl font-bold text-foreground">{data.highCourtCases}</span>
                                <p className="text-sm text-muted-foreground mt-2">Cases on record</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
