'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search companies by name, CIPC number..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
            <Button type="submit">Search</Button>
        </form>
    );
}
