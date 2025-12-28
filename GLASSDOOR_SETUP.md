# Glassdoor Integration Setup

This module provides an official integration with the Glassdoor API to display employer ratings and featured reviews for South African companies.

## Environment Variables

Add the following to your `.env` file:

```bash
# Glassdoor API Credentials
GLASSDOOR_PARTNER_ID=your_partner_id
GLASSDOOR_PARTNER_KEY=your_partner_key
GLASSDOOR_API_BASE=https://api.glassdoor.com/api/api.htm
REVIEW_CACHE_TTL_HOURS=24
```

## How Caching Works

1.  When a request is made for a company's ratings via `/api/external/glassdoor/employers?companyId=...`, the system first checks the `GlassdoorCache` table in the database.
2.  If a valid (non-expired) cache entry exists, it is returned immediately.
3.  If no cache exists or it has expired (default: 24h), the system makes a server-side request to the Glassdoor API using the configured Partner ID and Key.
4.  The response is sanitized, stored in the database cache, and returned.

## Mandatory Attribution

Any page displaying Glassdoor-derived content MUST include the `GlassdoorAttribution` component:

```tsx
import { GlassdoorAttribution } from '@/components/glassdoor-attribution';

// ... in your component
<GlassdoorAttribution />
```

## API Endpoint

`GET /api/external/glassdoor/employers?companyId=[ID]&companyName=[Optional Name]`

- **Requirement**: User must be authenticated.
- **Headers**: Automatically passes viewer `userip` and `useragent` to Glassdoor as required by their terms.
