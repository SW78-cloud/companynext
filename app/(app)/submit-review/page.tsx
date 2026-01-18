"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reviewSchema, type ReviewInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { CompanySearch } from '@/components/dashboard/CompanySearch';

export default function SubmitReviewPage() {
    const router = useRouter();
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<ReviewInput>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            isAnonymous: true,
            ratingsJson: { overall: 3, payFairness: 3 }, // Defaults
            employmentType: 'PERM', // Corrected enum value
        }
    });

    const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
    const isAnonymous = watch('isAnonymous');

    const handleCompanySelect = (id: string) => {
        setCompanyId(id);
        setValue('companyId', id);
        // In real app, fetch name by ID or pass it from search component
        setCompanyName('Selected Company ' + id);
    };

    const onSubmit = async (data: ReviewInput) => {
        if (!companyId) {
            setError('Please select a company first.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Mock API call
            // await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) });

            // Simulation
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="container max-w-md py-12">
                <Card>
                    <CardHeader className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <CardTitle>Review Submitted</CardTitle>
                        <CardDescription>
                            Thank you for your feedback. Your review is pending moderation.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" onClick={() => router.push('/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-8">
            <h1 className="text-3xl font-bold mb-6">Write a Review</h1>

            {!companyId ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Select a Company</CardTitle>
                        <CardDescription>Search for the company you want to review.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CompanySearch onSelect={handleCompanySelect} />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Reviewing {companyName}</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCompanyId(null)}>Change Company</Button>
                        </div>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Anonymity Toggle */}
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Anonymous Review</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Your details will be hidden. Publicly shown as &quot;Verified User&quot;.
                                    </p>
                                </div>
                                <Switch
                                    checked={isAnonymous}
                                    onCheckedChange={(checked) => setValue('isAnonymous', checked)}
                                />
                            </div>

                            {/* Employment Type */}
                            <div className="space-y-2">
                                <Label>Employment Type</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="PERM" {...register('employmentType')} />
                                        <span>Permanent</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="CONTRACTOR" {...register('employmentType')} />
                                        <span>Contractor</span>
                                    </label>
                                </div>
                                {errors.employmentType && <p className="text-xs text-destructive">{errors.employmentType.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Review Title</Label>
                                <Input id="title" {...register('title')} placeholder="e.g. Great work culture" />
                                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body">Review Content</Label>
                                <Textarea id="body" {...register('body')} placeholder="Share your experience..." className="min-h-[150px]" />
                                {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            )}
        </div>
    );
}
