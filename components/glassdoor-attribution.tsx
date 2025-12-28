import React from 'react';
import Image from 'next/image';

export function GlassdoorAttribution() {
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <a
                href='http://www.glassdoor.com:8080/index.htm'
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
            >
                powered by
                <Image
                    src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png'
                    title='Job Search'
                    alt="Glassdoor Logo"
                    width={80}
                    height={15}
                    className="inline-block"
                />
            </a>
        </div>
    );
}
