"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, Building2, Briefcase, Building, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IndividualOnboardingForm } from '@/components/onboarding/individual-form';
import { VendorOnboardingForm } from '@/components/onboarding/vendor-form';
import { CompanyOnboardingForm } from '@/components/onboarding/company-form';




type Step = 1 | 2;

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [accountType, setAccountType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Load initial state
    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch('/api/auth/verification-status');

                // If unauthorized, middleware should have redirected, but just in case
                if (res.status === 401) {
                    return;
                }

                const data = await res.json();

                if (data.accountType) {
                    setAccountType(data.accountType);
                    setStep(2);
                }
            } catch (error) {
                console.error('Failed to fetch status:', error);
            } finally {
                setIsFetching(false);
            }
        }
        fetchStatus();
    }, []);

    const handleSetAccountType = async () => {
        if (!accountType) return;
        setIsLoading(true);

        try {
            const res = await fetch('/api/onboarding/set-account-type', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType }),
            });

            if (res.ok) {
                setStep(2);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update account type');
            }
        } catch (error) {
            console.error('Error setting account type:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        handleSetAccountType();
    };

    if (isFetching) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/5">
                <div className="animate-pulse text-muted-foreground">Loading onboarding...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-muted/5">
            <div className="mb-8 w-full max-w-4xl">
                {/* Stepper */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                        step === 1 ? "border-primary bg-primary text-primary-foreground" : "border-primary bg-primary/20 text-primary"
                    )}>
                        {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <div className="w-12 h-0.5 bg-muted" />
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                        step === 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                    )}>
                        2
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center tracking-tight">
                    {step === 1 ? "Tell us about yourself" : "Complete your profile"}
                </h1>
                <p className="text-muted-foreground text-center mt-2">
                    {step === 1 ? "Select the account type that best describes you" : "Provide a few more details to finish setting up your account"}
                </p>
            </div>

            {step === 1 ? (
                <div className="w-full max-w-4xl grid gap-6 sm:grid-cols-2">
                    <AccountTypeCard
                        id="INDIVIDUAL"
                        title="Individual"
                        description="Professional or job seeker looking for company insights"
                        icon={<User className="w-6 h-6" />}
                        selected={accountType === 'INDIVIDUAL'}
                        onSelect={() => setAccountType('INDIVIDUAL')}
                    />
                    <AccountTypeCard
                        id="VENDOR"
                        title="Vendor"
                        description="Vendor (providing companies with resources)"
                        icon={<Briefcase className="w-6 h-6" />}
                        selected={accountType === 'VENDOR'}
                        onSelect={() => setAccountType('VENDOR')}
                    />
                    <AccountTypeCard
                        id="PRIVATE_COMPANY"
                        title="Private Company"
                        description="Representing a privately held business"
                        icon={<Building2 className="w-6 h-6" />}
                        selected={accountType === 'PRIVATE_COMPANY'}
                        onSelect={() => setAccountType('PRIVATE_COMPANY')}
                    />
                    <AccountTypeCard
                        id="PUBLIC_COMPANY"
                        title="Public Company"
                        description="Representing a publicly traded corporation"
                        icon={<Building className="w-6 h-6" />}
                        selected={accountType === 'PUBLIC_COMPANY'}
                        onSelect={() => setAccountType('PUBLIC_COMPANY')}
                    />

                    <div className="sm:col-span-2 flex justify-end mt-4">
                        <Button
                            size="lg"
                            disabled={!accountType || isLoading}
                            onClick={handleContinue}
                        >
                            {isLoading ? "Saving..." : "Continue"}
                            {!isLoading && <ChevronRight className="ml-2 w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            ) : accountType === 'INDIVIDUAL' ? (
                <IndividualOnboardingForm
                    onBack={() => setStep(1)}
                    onSuccess={() => router.push('/')}
                />
            ) : accountType === 'VENDOR' ? (
                <VendorOnboardingForm
                    onBack={() => setStep(1)}
                    onSuccess={() => router.push('/')}
                />
            ) : (accountType === 'PRIVATE_COMPANY' || accountType === 'PUBLIC_COMPANY') ? (
                <CompanyOnboardingForm
                    accountType={accountType}
                    onBack={() => setStep(1)}
                    onSuccess={() => router.push('/')}
                />
            ) : (


                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>
                            You&apos;ve selected <strong>{accountType ? accountType.replace('_', ' ') : ''}</strong> role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                        <div className="text-center">
                            <p className="text-muted-foreground">Dynamic form for {accountType} will be here.</p>
                            <p className="text-xs text-muted-foreground mt-1">(Skeleton Step 2)</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6">
                        <Button variant="ghost" onClick={() => setStep(1)}>
                            Back
                        </Button>
                        <Button disabled>
                            Complete Onboarding
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}

function AccountTypeCard({ id, title, description, icon, selected, onSelect }: any) {
    return (
        <Card
            className={cn(
                "relative cursor-pointer transition-all hover:shadow-md border-2",
                selected ? "border-primary bg-primary/5" : "border-transparent hover:border-muted-foreground/20"
            )}
            onClick={onSelect}
        >
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
                <div className={cn(
                    "p-2 rounded-lg",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                    {icon}
                </div>
                <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-sm">
                    {description}
                </CardDescription>
            </CardContent>
            {selected && (
                <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                    </div>
                </div>
            )}
        </Card>
    );
}
