# CompanyNext

A production-ready Next.js application providing transparent company insights from public records and user reviews.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Clerk (email OTP/magic link)
- **Background Jobs**: pg-boss (using PostgreSQL)
- **Testing**: Playwright (E2E) + Vitest (unit)
- **Rate Limiting**: Upstash Redis

## 📋 Prerequisites

- Node.js 18+ (recommended: Node 20 via nvm)
- pnpm (package manager)
- Docker and Docker Compose (for PostgreSQL)
- Clerk account (for authentication) - [Get started](https://clerk.com)
- Upstash account (for rate limiting) - [Get started](https://upstash.com)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd CompanyNext-Cursor-Platform
ppnpm install
```

### 2. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://companynext:companynext@localhost:5432/companynext?schema=public"

# Clerk Authentication (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/my-account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/my-account

# Upstash Redis (get from https://console.upstash.com)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

Verify PostgreSQL is running:

```bash
docker-compose ps
```

### 4. Database Setup

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database with sample data:

```bash
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 6. Start Background Worker (Optional)

In a separate terminal:

```bash
pnpm worker
```

The worker will process background jobs and run the demo `hello_job` every 5 minutes.

## 📁 Project Structure

```
CompanyNext-Cursor-Platform/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages (landing, search, company detail)
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (app)/               # Protected app pages (my-account, submit-review)
│   ├── (admin)/             # Admin pages (dashboard)
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout with ClerkProvider
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── header.tsx           # Site header
│   ├── footer.tsx           # Site footer
│   ├── search-bar.tsx       # Search component
│   ├── metric-card.tsx      # Metrics display
│   ├── chart-placeholder.tsx # Chart placeholder
│   └── data-table.tsx       # Generic table component
├── lib/                     # Utilities and helpers
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # Auth helpers
│   ├── rbac.ts              # Role-based access control
│   ├── validators.ts        # Zod schemas
│   ├── audit.ts             # Audit logging
│   ├── rate-limit.ts        # Rate limiting
│   ├── errors.ts            # Error handling
│   └── utils.ts             # General utilities
├── jobs/                    # Background jobs
│   ├── worker.ts            # pg-boss worker
│   ├── index.ts             # Job client
│   └── definitions/         # Job handlers
├── prisma/                  # Database
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── connectors/              # Data connector framework
│   └── README.md            # Connector guidelines
├── tests/                   # Tests
│   ├── e2e/                 # Playwright E2E tests
│   └── unit/                # Vitest unit tests
├── docker-compose.yml       # PostgreSQL container
├── middleware.ts            # Clerk authentication middleware
└── package.json             # Dependencies and scripts
```

## 🔑 User Roles & Permissions

The application implements RBAC with four roles:

| Role | Permissions |
|------|------------|
| **Visitor** | View public pages only |
| **Employee** | View public pages, submit reviews, view own reviews |
| **Contractor** | View public pages, submit reviews, view own reviews |
| **Admin** | All permissions + user management, review moderation, admin dashboard |

## 📊 Database Models

- **User**: User accounts with roles
- **Company**: Company information and metadata
- **Vendor**: Recruitment/staffing vendors
- **ContractorPlacement**: Contractor placement records
- **CaseRecord**: Public legal case records
- **Review**: User-submitted company reviews
- **AuditLog**: Comprehensive audit trail
- **IngestionRun**: Background job execution tracking

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/companies/search?q={query}` - Search companies
- `GET /api/companies/:id/metrics` - Get company metrics
- `GET /api/companies/:id/cases` - Get company case records

### Protected Endpoints

- `POST /api/reviews` - Submit a review (requires authentication)

All public endpoints are rate-limited to prevent abuse.

## 🧪 Testing

### Run Unit Tests

```bash
pnpm test:unit
```

### Run E2E Tests

```bash
pnpm test:e2e
```

### Run E2E Tests with UI

```bash
pnpm test:e2e:ui
```

## 🗄️ Database Commands

### View Database in Prisma Studio

```bash
pnpm db:studio
```

### Create a New Migration

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database (WARNING: Deletes all data)

```bash
npx prisma migrate reset
```

## 🔐 Security Features

- **Authentication**: Clerk-based authentication with email OTP/magic link
- **RBAC**: Role-based access control for routes and features
- **Rate Limiting**: Upstash Redis-based rate limiting on public endpoints
- **Input Validation**: Zod schemas for all API inputs
- **Audit Logging**: Comprehensive audit trail for all data changes
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🌍 Data Sources & Ethics

CompanyNext only collects data from publicly available sources:

- Public legal records (CCMA, Labour Courts, High Courts)
- Company registration data (CIPC)
- User-submitted reviews (moderated)

**We do NOT:**
- Scrape password-protected or gated websites
- Bypass CAPTCHAs or anti-bot measures
- Access any data requiring authentication

See the [Sources & Limitations](/sources) page for more details.

## 📝 Development Workflow

1. **Planning**: Review requirements and create implementation plan
2. **Database**: Update Prisma schema and create migrations
3. **Backend**: Implement API routes with validation and error handling
4. **Frontend**: Build UI components and pages
5. **Testing**: Write unit and E2E tests
6. **Review**: Test locally and verify all features work

## 🚀 Deployment Considerations

### Environment Variables

Ensure all production environment variables are set:
- Use production Clerk keys
- Use production Upstash Redis instance
- Set `NODE_ENV=production`
- Update `NEXT_PUBLIC_APP_URL` to your domain

### Database

- Use a managed PostgreSQL service (e.g., Supabase, Neon, Railway)
- Run migrations: `npx prisma migrate deploy`
- Ensure connection pooling is configured

### Background Worker

Deploy the worker as a separate service or long-running process:

```bash
pnpm worker
```

Consider using a process manager like PM2 or deploying to a platform that supports background workers.

### Next.js

Deploy to Vercel, Netlify, or any platform supporting Next.js:

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

This project is for demonstration purposes.

## 🆘 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Prisma Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Reset database and reseed
npx prisma migrate reset
```

### Clerk Authentication Issues

- Verify your Clerk API keys are correct
- Check that Clerk URLs match your environment
- Ensure your domain is added to Clerk's allowed origins

## 📞 Support

For issues or questions:
1. Check the documentation above
2. Review the [Sources & Limitations](/sources) page
3. Check existing GitHub issues
4. Create a new issue with detailed information

---

Built with ❤️ using Next.js, Prisma, and Clerk
