"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function DebugSessionBanner() {
    const [status, setStatus] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        fetch('/api/auth/verification-status')
            .then(res => res.json())
            .then(data => setStatus(data))
            .catch(err => console.error('Debug banner failed', err));
    }, [pathname]);

    if (process.env.NODE_ENV !== 'development') return null;
    if (!status) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white p-4 rounded-md text-xs font-mono shadow-lg border border-white/20 max-w-xs overflow-hidden">
            <h3 className="font-bold mb-2 text-green-400">DEBUG SESSION</h3>
            <div className="space-y-1">
                <p><span className="text-gray-400">Path:</span> {pathname}</p>
                <p><span className="text-gray-400">Auth:</span> {status.error ? 'Checking...' : (status.userId ? 'YES' : 'NO')}</p>
                {status.userId && (
                    <>
                        <p><span className="text-gray-400">Verified:</span> {status.emailVerified ? 'TRUE' : 'FALSE'}</p>
                        <p><span className="text-gray-400">Status:</span> {status.onboardingStatus}</p>
                        <p><span className="text-gray-400">Type:</span> {status.accountType || 'N/A'}</p>
                    </>
                )}
            </div>
        </div>
    );
}
