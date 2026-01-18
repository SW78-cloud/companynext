"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateFairnessIndex } from '@/lib/market-intelligence/scoring';

export default function ScoringSandbox() {
    const [ratings, setRatings] = useState({
        paymentDiscipline: 5,
        transparency: 5,
        support: 5,
        safety: 5
    });

    const score = calculateFairnessIndex(ratings);

    return (
        <div className="container py-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Scoring Logic Sandbox</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Calculate Fairness Index</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Payment Discipline (Weight 2.0)</Label>
                            <Input
                                type="number"
                                min="1" max="5"
                                value={ratings.paymentDiscipline}
                                onChange={(e) => setRatings({ ...ratings, paymentDiscipline: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Transparency (Weight 1.5)</Label>
                            <Input
                                type="number"
                                min="1" max="5"
                                value={ratings.transparency}
                                onChange={(e) => setRatings({ ...ratings, transparency: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Support (Weight 1.0)</Label>
                            <Input
                                type="number"
                                min="1" max="5"
                                value={ratings.support}
                                onChange={(e) => setRatings({ ...ratings, support: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Safety (Weight 2.0)</Label>
                            <Input
                                type="number"
                                min="1" max="5"
                                value={ratings.safety}
                                onChange={(e) => setRatings({ ...ratings, safety: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest">Calculated Index</p>
                        <div className="text-4xl font-black text-primary">{score} / 100</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
