'use client';

import { Search } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

function SearchBarContent({ small, className }: { small?: boolean, className?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');

    // Initialize query from URL if available
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) setQuery(q);
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "flex w-full gap-2 transition-all",
                !small && "max-w-2xl",
                className
            )}
        >
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={small ? "Search companies..." : "Search by company name, trading name, or CIPC..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={cn(
                        "pl-10 bg-background",
                        small ? "h-9 text-sm" : "h-11 text-base shadow-sm"
                    )}
                />
            </div>
            {!small && (
                <Button type="submit" size="lg" className="px-8 shadow-sm">
                    Search
                </Button>
            )}
        </form>
    );
}

export function SearchBar({ small, className }: { small?: boolean, className?: string }) {
    return (
        <Suspense fallback={
            <div className={cn("flex w-full gap-2", !small && "max-w-2xl", className)}>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className={cn("pl-10", small ? "h-9" : "h-11")}
                        placeholder={small ? "Search companies..." : "Search..."}
                        disabled
                    />
                </div>
                {!small && <Button disabled size="lg" className="px-8">Search</Button>}
            </div>
        }>
            <SearchBarContent small={small} className={className} />
        </Suspense>
    );
}
