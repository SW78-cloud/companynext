"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Loader2, Plus, Trash2, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

const vendorSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyAddress: z.string().min(5, "Address must be at least 5 characters"),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters"),
    businessEmail: z.string().email("Invalid business email"),
    clients: z.array(z.object({
        clientName: z.string().min(2, "Client name must be at least 2 characters"),
        staffCount: z.coerce.number().int().positive("Staff count must be a positive integer"),
    })).min(1, "At least one client is required"),
    clientsEarlyTerminationHabit: z.boolean(),
    earlyTerminationClients: z.array(z.string()).optional(),
}).refine((data) => {
    if (data.clientsEarlyTerminationHabit) {
        return !!data.earlyTerminationClients && data.earlyTerminationClients.length > 0;
    }
    return true;
}, {
    message: "At least one early termination client must be specified",
    path: ["earlyTerminationClients"],
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface VendorOnboardingFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export function VendorOnboardingForm({ onBack, onSuccess }: VendorOnboardingFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<VendorFormValues>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            clients: [{ clientName: '', staffCount: 1 }],
            clientsEarlyTerminationHabit: false,
            earlyTerminationClients: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "clients"
    });

    const clientsEarlyTerminationHabit = watch('clientsEarlyTerminationHabit');
    const selectedUsers = watch('earlyTerminationClients') || [];
    const clientList = watch('clients');

    const toggleEarlyTerminationClient = (clientName: string) => {
        const currentSelected = watch('earlyTerminationClients') || [];
        if (currentSelected.includes(clientName)) {
            setValue('earlyTerminationClients', currentSelected.filter(name => name !== clientName));
        } else {
            setValue('earlyTerminationClients', [...currentSelected, clientName]);
        }
    };

    const onSubmit = async (data: VendorFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/onboarding/vendor', {
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle>Vendor Profile</CardTitle>
                    <CardDescription>
                        Provide details about your company and the clients you serve.
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
                                    placeholder="Company Name"
                                    {...register('companyName')}
                                    className={errors.companyName ? "border-destructive" : ""}
                                />
                                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    placeholder="2023/123456/07"
                                    {...register('registrationNumber')}
                                    className={errors.registrationNumber ? "border-destructive" : ""}
                                />
                                {errors.registrationNumber && <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyAddress">Company Address</Label>
                            <Input
                                id="companyAddress"
                                placeholder="123 Business Rd, Sandton, 2196"
                                {...register('companyAddress')}
                                className={errors.companyAddress ? "border-destructive" : ""}
                            />
                            {errors.companyAddress && <p className="text-xs text-destructive">{errors.companyAddress.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessEmail">Business Email</Label>
                            <Input
                                id="businessEmail"
                                type="email"
                                placeholder="info@company.com"
                                {...register('businessEmail')}
                                className={errors.businessEmail ? "border-destructive" : ""}
                            />
                            {errors.businessEmail && <p className="text-xs text-destructive">{errors.businessEmail.message}</p>}
                        </div>
                    </div>

                    <div className="h-px bg-muted" />

                    {/* Clients List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Clients Served</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ clientName: '', staffCount: 1 })}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add client
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/5">
                                    <div className="flex-1 grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`clients.${index}.clientName`}>Client Name</Label>
                                            <Input
                                                id={`clients.${index}.clientName`}
                                                placeholder="e.g. Standard Bank"
                                                {...register(`clients.${index}.clientName` as const)}
                                                className={errors.clients?.[index]?.clientName ? "border-destructive" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`clients.${index}.staffCount`}>Staff Count</Label>
                                            <Input
                                                id={`clients.${index}.staffCount`}
                                                type="number"
                                                min="1"
                                                {...register(`clients.${index}.staffCount` as const, { valueAsNumber: true })}
                                                className={errors.clients?.[index]?.staffCount ? "border-destructive" : ""}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="mt-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => remove(index)}
                                        disabled={fields.length <= 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {errors.clients?.message && <p className="text-xs text-destructive">{errors.clients.message}</p>}
                    </div>

                    <div className="h-px bg-muted" />

                    {/* Early Termination Habit */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5">
                            <div className="space-y-0.5">
                                <Label className="text-base">Early Termination Habit</Label>
                                <p className="text-sm text-muted-foreground">
                                    Do clients have a habit of terminating resources early?
                                </p>
                            </div>
                            <Switch
                                checked={clientsEarlyTerminationHabit}
                                onCheckedChange={(checked) => setValue('clientsEarlyTerminationHabit', checked)}
                            />
                        </div>

                        {clientsEarlyTerminationHabit && (
                            <div className="space-y-3 p-4 border rounded-lg bg-destructive/5 animate-in fade-in slide-in-from-top-2">
                                <Label className="text-sm font-semibold text-destructive">Which clients are known for this?</Label>
                                <div className="grid gap-2">
                                    {clientList.map((client, index) => (
                                        client.clientName && (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`terminate-${index}`}
                                                    checked={selectedUsers.includes(client.clientName)}
                                                    onCheckedChange={() => toggleEarlyTerminationClient(client.clientName)}
                                                />
                                                <label
                                                    htmlFor={`terminate-${index}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-available peer-disabled:opacity-70"
                                                >
                                                    {client.clientName}
                                                </label>
                                            </div>
                                        )
                                    ))}
                                </div>
                                {errors.earlyTerminationClients && (
                                    <p className="text-xs text-destructive mt-1">{errors.earlyTerminationClients.message}</p>
                                )}
                            </div>
                        )}
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
