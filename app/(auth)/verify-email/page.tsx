"use client";


import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);
    const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);

    // Check verification status
    const checkStatus = useCallback(async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/verification-status');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to check status');
            }

            setIsVerified(data.emailVerified);
            setOnboardingStatus(data.onboardingStatus);

            // If verified, redirect based on onboarding status
            if (data.emailVerified) {
                if (data.onboardingStatus === 'COMPLETE') {
                    router.push('/');
                } else {
                    router.push('/onboarding');
                }
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // Resend verification email
    const handleResend = async () => {
        setIsResending(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to resend verification email');
            }

            setMessage({
                type: 'success',
                text: data.message || 'Verification email sent! Please check your inbox.',
            });
            setRemaining(data.remaining ?? null);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsResending(false);
        }
    };

    // Check status on mount
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Poll for verification status every 5 seconds if not verified
    useEffect(() => {
        if (isVerified) return;

        const interval = setInterval(() => {
            checkStatus();
        }, 5000);

        return () => clearInterval(interval);
    }, [isVerified, checkStatus]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-muted/5">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {message && (
                        <div
                            className={`p-3 text-sm rounded-md flex items-center gap-2 ${message.type === 'success'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-red-50 text-red-600'
                                }`}
                        >
                            {message.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <AlertCircle className="w-4 h-4" />
                            )}
                            {message.text}
                        </div>
                    )}

                    {remaining !== null && remaining < 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                            {remaining} verification email{remaining !== 1 ? 's' : ''} remaining this hour
                        </p>
                    )}

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Didn&apos;t receive the email?</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Check your spam or junk folder</li>
                            <li>Make sure you entered the correct email address</li>
                            <li>Wait a few minutes for the email to arrive</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        onClick={handleResend}
                        disabled={isResending || isLoading}
                        className="w-full"
                        variant="outline"
                    >
                        {isResending ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend email
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={checkStatus}
                        disabled={isLoading}
                        className="w-full"
                        variant="ghost"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh status
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

