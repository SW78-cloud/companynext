"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock type for search result
interface CompanySearchResult {
    id: string;
    name: string;
    industry: string;
    cipcNumber: string;
}

export function CompanySearch({ onSelect }: { onSelect: (companyId: string) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CompanySearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);

        // Mock search logic - replace with actual API call
        // const res = await fetch(`/api/companies/search?q=${query}`);
        // const data = await res.json();

        // Simulating delay and results
        setTimeout(() => {
            const mockResults = [
                { id: '1', name: 'Acme Holdings Pty Ltd', industry: 'Technology', cipcNumber: '2023/123456/07' },
                { id: '2', name: 'Global Trade Corp', industry: 'Logistics', cipcNumber: '2020/987654/07' },
                { id: '3', name: 'Sunshine Retailers', industry: 'Retail', cipcNumber: '2015/555111/07' },
            ].filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

            setResults(mockResults);
            setIsSearching(false);
        }, 500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Search for a company (e.g. Acme)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? 'Searching...' : 'Search'}
                </Button>
            </div>

            {results.length > 0 && (
                <Card>
                    <CardContent className="p-2 space-y-1">
                        {results.map((company) => (
                            <div
                                key={company.id}
                                className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors flex justify-between items-center"
                                onClick={() => onSelect(company.id)}
                            >
                                <div>
                                    <div className="font-medium">{company.name}</div>
                                    <div className="text-xs text-muted-foreground">{company.industry} • {company.cipcNumber}</div>
                                </div>
                                <Button variant="ghost" size="sm">View</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {results.length === 0 && query && !isSearching && (
                <div className="text-center text-muted-foreground text-sm">No companies found</div>
            )}
        </div>
    );
}
