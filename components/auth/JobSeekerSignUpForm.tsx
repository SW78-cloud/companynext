"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { jobSeekerRegisterSchema, type JobSeekerRegisterInput } from '@/lib/validators';

const STEPS = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Employment' },
    { id: 3, title: 'Account' },
];

export function JobSeekerSignUpForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<JobSeekerRegisterInput>({
        resolver: zodResolver(jobSeekerRegisterSchema),
        defaultValues: {
            name: '',
            surname: '',
            employmentType: 'PERMANENT',
            companyName: '',
            contractHouse: '',
            placedAtClient: '',
            email: '',
            username: '',
            password: '',
        },
        mode: 'onTouched',
    });

    const { register, handleSubmit, watch, trigger, formState: { errors } } = form;
    const employmentType = watch('employmentType');

    const nextStep = async () => {
        let fieldsToValidate: (keyof JobSeekerRegisterInput)[] = [];
        if (step === 1) {
            fieldsToValidate = ['name', 'surname', 'employmentType'];
        } else if (step === 2) {
            if (employmentType === 'PERMANENT') {
                fieldsToValidate = ['companyName'];
            } else {
                fieldsToValidate = ['contractHouse', 'placedAtClient'];
            }
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => {
        setStep(s => s - 1);
    };

    const onSubmit = async (data: JobSeekerRegisterInput) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register/job-seeker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            // Redirect to login or onboarding success
            router.refresh();
            router.push('/login?registered=true'); // Or a dedicated success page
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 
                                ${step >= s.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>
                                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                            </div>
                            <span className="text-xs mt-1 text-muted-foreground">{s.title}</span>
                        </div>
                    ))}
                    {/* Progress connector lines could go here */}
                </div>
                <CardTitle className="text-2xl font-bold text-center mt-4">Job Seeker Sign Up</CardTitle>
                <CardDescription className="text-center">
                    Step {step} of 3: {STEPS[step - 1].title}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 min-h-[300px]">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">First Name</Label>
                                    <Input id="name" {...register('name')} placeholder="Jane" />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="surname">Surname</Label>
                                    <Input id="surname" {...register('surname')} placeholder="Doe" />
                                    {errors.surname && <p className="text-xs text-destructive">{errors.surname.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Employment Type</Label>
                                <RadioGroup
                                    defaultValue="PERMANENT"
                                    value={employmentType}
                                    onValueChange={(val) => form.setValue('employmentType', val as 'PERMANENT' | 'CONTRACTOR', { shouldValidate: true })}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div>
                                        <RadioGroupItem value="PERMANENT" id="perm" className="peer sr-only" />
                                        <Label
                                            htmlFor="perm"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                            <span className="text-sm font-semibold">Permanent</span>
                                            <span className="text-xs text-muted-foreground mt-1">Full-time employee</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="CONTRACTOR" id="contractor" className="peer sr-only" />
                                        <Label
                                            htmlFor="contractor"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                            <span className="text-sm font-semibold">Contractor</span>
                                            <span className="text-xs text-muted-foreground mt-1">Freelance / Contract</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {errors.employmentType && <p className="text-xs text-destructive">{errors.employmentType.message}</p>}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {employmentType === 'PERMANENT' ? (
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input id="companyName" {...register('companyName')} placeholder="Acme Inc." />
                                    {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="contractHouse">Contract House (Agency)</Label>
                                        <Input id="contractHouse" {...register('contractHouse')} placeholder="Tech Recruiters Ltd." />
                                        {errors.contractHouse && <p className="text-xs text-destructive">{errors.contractHouse.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="placedAtClient">Placed at Client</Label>
                                        <Input id="placedAtClient" {...register('placedAtClient')} placeholder="Big Bank Corp." />
                                        {errors.placedAtClient && <p className="text-xs text-destructive">{errors.placedAtClient.message}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" {...register('email')} placeholder="jane@example.com" />
                                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" {...register('username')} placeholder="janedeo123" />
                                <p className="text-xs text-muted-foreground">This will be your display name.</p>
                                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register('password')} />
                                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 3 ? (
                        <Button type="button" onClick={nextStep}>
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
                        </Button>
                    )}
                </CardFooter>
                <div className="pb-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </Card>
    );
}
