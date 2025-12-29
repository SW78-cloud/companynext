"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Plus, Trash2, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const companySchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyAddress: z.string().min(5, "Address must be at least 5 characters"),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters"),
    sector: z.enum(['PRIVATE', 'PUBLIC']),
    numberOfEmployees: z.coerce.number().int().positive("Employee count must be a positive integer"),
    businessEmail: z.string().email("Invalid business email"),
    vendorList: z.array(z.object({
        vendorName: z.string().min(2, "Vendor name must be at least 2 characters"),
        staffCount: z.coerce.number().int().positive("Staff count must be a positive integer"),
    })).min(1, "At least one vendor is required"),
});



type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyOnboardingFormProps {
    accountType: 'PRIVATE_COMPANY' | 'PUBLIC_COMPANY' | string;
    onBack: () => void;
    onSuccess: () => void;
}

export function CompanyOnboardingForm({ accountType, onBack, onSuccess }: CompanyOnboardingFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            sector: accountType === 'PUBLIC_COMPANY' ? 'PUBLIC' : 'PRIVATE',
            vendorList: [{ vendorName: '', staffCount: 1 }],
            numberOfEmployees: 1,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "vendorList"
    });


    const onSubmit = async (data: CompanyFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/onboarding/company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const result = await res.json();
                setError(result.error || 'Failed to save company profile');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Company Profile Details
                    </CardTitle>
                    <CardDescription>
                        Complete your {accountType === 'PUBLIC_COMPANY' ? 'Public' : 'Private'} Company profile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Basic Company Info */}
                    <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    placeholder="e.g. Acme South Africa"
                                    {...register('companyName')}
                                    className={errors.companyName ? "border-destructive" : ""}
                                />
                                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    placeholder="2023/456789/07"
                                    {...register('registrationNumber')}
                                    className={errors.registrationNumber ? "border-destructive" : ""}
                                />
                                {errors.registrationNumber && <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                                <Input
                                    id="numberOfEmployees"
                                    type="number"
                                    min="1"
                                    {...register('numberOfEmployees')}
                                    className={errors.numberOfEmployees ? "border-destructive" : ""}
                                />
                                {errors.numberOfEmployees && <p className="text-xs text-destructive">{errors.numberOfEmployees.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessEmail">Business Email</Label>
                                <Input
                                    id="businessEmail"
                                    type="email"
                                    placeholder="corporate@company.co.za"
                                    {...register('businessEmail')}
                                    className={errors.businessEmail ? "border-destructive" : ""}
                                />
                                {errors.businessEmail && <p className="text-xs text-destructive">{errors.businessEmail.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyAddress">HQ Address</Label>
                            <Input
                                id="companyAddress"
                                placeholder="Grid Centre, Rosebank, Johannesburg"
                                {...register('companyAddress')}
                                className={errors.companyAddress ? "border-destructive" : ""}
                            />
                            {errors.companyAddress && <p className="text-xs text-destructive">{errors.companyAddress.message}</p>}
                        </div>
                    </div>

                    <div className="h-px bg-muted" />

                    {/* Vendors Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold">External Resource Vendors</Label>
                                <p className="text-sm text-muted-foreground">List major vendors providing staff to your company (at least 1 required).</p>

                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ vendorName: '', staffCount: 1 })}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add vendor
                            </Button>
                        </div>

                        {errors.vendorList && !Array.isArray(errors.vendorList) && (
                            <p className="text-sm text-destructive font-medium">{(errors.vendorList as any).message}</p>
                        )}

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/5 relative group">
                                    <div className="flex-1 grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`vendorList.${index}.vendorName`}>Vendor Legal Name</Label>
                                            <Input
                                                id={`vendorList.${index}.vendorName`}
                                                placeholder="e.g. Entelect"
                                                {...register(`vendorList.${index}.vendorName` as const)}
                                                className={errors.vendorList?.[index]?.vendorName ? "border-destructive" : ""}
                                            />
                                            {errors.vendorList?.[index]?.vendorName && <p className="text-xs text-destructive">{errors.vendorList[index]?.vendorName?.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`vendorList.${index}.staffCount`}>Vendor Staff Count</Label>
                                            <Input
                                                id={`vendorList.${index}.staffCount`}
                                                type="number"
                                                min="1"
                                                {...register(`vendorList.${index}.staffCount` as const, { valueAsNumber: true })}
                                                className={errors.vendorList?.[index]?.staffCount ? "border-destructive" : ""}
                                            />
                                            {errors.vendorList?.[index]?.staffCount && <p className="text-xs text-destructive">{errors.vendorList[index]?.staffCount?.message}</p>}
                                        </div>
                                    </div>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="mt-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center py-6 border border-destructive border-dashed rounded-lg text-destructive bg-destructive/5">
                                    At least one vendor is required.
                                </div>
                            )}
                        </div>

                    </div>

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
