"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

const WorkerType = {
    PERMANENT: 'PERMANENT',
    CONTRACTOR: 'CONTRACTOR',
} as const;

const individualSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    workerType: z.enum(['PERMANENT', 'CONTRACTOR']),
    currentCompany: z.string().optional(),
    contractHouse: z.string().optional(),
    placedAtClient: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.workerType === 'PERMANENT') {
        if (!data.currentCompany || data.currentCompany.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Current company is required",
                path: ["currentCompany"],
            });
        }
    }
    if (data.workerType === 'CONTRACTOR') {
        if (!data.contractHouse || data.contractHouse.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Contract house / Agency is required",
                path: ["contractHouse"],
            });
        }
        if (!data.placedAtClient || data.placedAtClient.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Placed at client is required",
                path: ["placedAtClient"],
            });
        }
    }
});

type IndividualFormValues = z.infer<typeof individualSchema>;

interface IndividualOnboardingFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export function IndividualOnboardingForm({ onBack, onSuccess }: IndividualOnboardingFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<IndividualFormValues>({
        resolver: zodResolver(individualSchema),
        defaultValues: {
            workerType: 'PERMANENT',
        }
    });

    const workerType = watch('workerType');

    const onSubmit = async (data: IndividualFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/onboarding/individual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const result = await res.json();
                setError(result.error || 'Failed to save profile');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">First Name</Label>
                            <Input
                                id="name"
                                placeholder="John"
                                {...register('name')}
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="surname">Surname</Label>
                            <Input
                                id="surname"
                                placeholder="Doe"
                                {...register('surname')}
                                className={errors.surname ? "border-destructive" : ""}
                            />
                            {errors.surname && <p className="text-xs text-destructive">{errors.surname.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Worker Type</Label>
                        <Select
                            onValueChange={(value) => setValue('workerType', value as any)}
                            defaultValue="PERMANENT"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select worker type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERMANENT">Permanent Employee</SelectItem>
                                <SelectItem value="CONTRACTOR">Contractor / Freelancer</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.workerType && <p className="text-xs text-destructive">{errors.workerType.message}</p>}
                    </div>

                    {workerType === 'PERMANENT' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="currentCompany">Current Company <span className="text-destructive">*</span></Label>
                            <Input
                                id="currentCompany"
                                placeholder="Enter company name"
                                {...register('currentCompany')}
                                className={errors.currentCompany ? "border-destructive" : ""}
                            />
                            {errors.currentCompany && <p className="text-xs text-destructive">{errors.currentCompany.message}</p>}
                        </div>
                    )}

                    {workerType === 'CONTRACTOR' && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <Label htmlFor="contractHouse">Contract House / Agency <span className="text-destructive">*</span></Label>
                                <Input
                                    id="contractHouse"
                                    placeholder="e.g. Entelect, OfferZen"
                                    {...register('contractHouse')}
                                    className={errors.contractHouse ? "border-destructive" : ""}
                                />
                                {errors.contractHouse && <p className="text-xs text-destructive">{errors.contractHouse.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="placedAtClient">Placed At Client <span className="text-destructive">*</span></Label>
                                <Input
                                    id="placedAtClient"
                                    placeholder="e.g. Standard Bank, Discovery"
                                    {...register('placedAtClient')}
                                    className={errors.placedAtClient ? "border-destructive" : ""}
                                />
                                {errors.placedAtClient && <p className="text-xs text-destructive">{errors.placedAtClient.message}</p>}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button type="button" variant="ghost" onClick={onBack} disabled={isSubmitting}>
                        Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Complete Onboarding"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
