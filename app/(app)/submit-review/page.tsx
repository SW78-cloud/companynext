'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

export default function SubmitReviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyId: '',
        roleType: '',
        overallRating: 5,
        redactedText: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: formData.companyId,
                    roleType: formData.roleType,
                    ratingsJson: { overall: formData.overallRating },
                    redactedText: formData.redactedText,
                }),
            });

            if (response.ok) {
                router.push('/my-account?success=review-submitted');
            } else {
                alert('Failed to submit review. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Submit a Review</h1>
                    <p className="text-muted-foreground">
                        Share your experience to help others make informed decisions.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-primary" />
                            <CardTitle>Review Form</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="companyId">Company ID</Label>
                                <Input
                                    id="companyId"
                                    value={formData.companyId}
                                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                                    placeholder="Enter company ID (from company page URL)"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Find the company first, then copy its ID from the URL
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="roleType">Your Role</Label>
                                <Input
                                    id="roleType"
                                    value={formData.roleType}
                                    onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                                    placeholder="e.g., Employee, Contractor, Client"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="rating">Overall Rating (1-10)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.overallRating}
                                    onChange={(e) =>
                                        setFormData({ ...formData, overallRating: parseInt(e.target.value) })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="review">Your Review</Label>
                                <textarea
                                    id="review"
                                    value={formData.redactedText}
                                    onChange={(e) => setFormData({ ...formData, redactedText: e.target.value })}
                                    placeholder="Share your experience (avoid including personal information)"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    maxLength={5000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.redactedText.length}/5000 characters
                                </p>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg text-sm">
                                <p className="font-semibold mb-2">Review Guidelines:</p>
                                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                                    <li>Be honest and constructive</li>
                                    <li>Do not include personal information</li>
                                    <li>Focus on your professional experience</li>
                                    <li>Reviews are moderated before publication</li>
                                </ul>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
