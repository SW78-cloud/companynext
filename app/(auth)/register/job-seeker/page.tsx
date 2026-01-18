"use client";

import { JobSeekerSignUpForm } from '@/components/auth/JobSeekerSignUpForm';

export default function JobSeekerRegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <JobSeekerSignUpForm />
        </div>
    );
}
