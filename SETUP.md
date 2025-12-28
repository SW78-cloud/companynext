# CompanyNext Setup Guide

## ⚠️ Docker Not Installed

Docker is not currently installed on your system. You have two options:

### Option 1: Install Docker Desktop (Recommended)

1. **Download Docker Desktop for Mac**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download and install Docker Desktop for macOS
   - Start Docker Desktop application

2. **Start PostgreSQL**
   ```bash
   docker compose up -d
   ```

3. **Verify PostgreSQL is running**
   ```bash
   docker compose ps
   ```

### Option 2: Use External PostgreSQL

If you prefer not to use Docker, you can use an external PostgreSQL service:

**Cloud Options:**
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Railway](https://railway.app) - Easy deployment
- [Render](https://render.com) - PostgreSQL hosting

**Steps:**
1. Create a PostgreSQL database on your chosen platform
2. Get the connection string (format: `postgresql://user:password@host:port/database`)
3. Update `.env` file:
   ```env
   DATABASE_URL="your_connection_string_here"
   ```

---

## 📝 Environment Configuration Required

The `.env` file has been created. You need to add your credentials:

### 1. Clerk Authentication

Get your keys from [dashboard.clerk.com](https://dashboard.clerk.com):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**How to get Clerk keys:**
1. Sign up at https://clerk.com
2. Create a new application
3. Go to "API Keys" in the dashboard
4. Copy the publishable and secret keys

### 2. Upstash Redis (for Rate Limiting)

Get your credentials from [console.upstash.com](https://console.upstash.com):

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**How to get Upstash credentials:**
1. Sign up at https://upstash.com
2. Create a new Redis database
3. Go to "Details" tab
4. Copy the REST URL and REST Token

---

## 🚀 Next Steps (After Setting Up Database)

Once you have PostgreSQL running (via Docker or external service):

### 1. Run Database Migrations
```bash
npm run db:migrate
```

### 2. Seed Sample Data
```bash
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Start Background Worker (Optional)
In a separate terminal:
```bash
npm run worker
```

---

## 🔍 Verify Setup

After completing the steps above:

1. **Check if PostgreSQL is accessible**
   ```bash
   npx prisma studio
   ```
   This should open Prisma Studio in your browser

2. **Test the application**
   - Visit http://localhost:3000
   - Try searching for companies
   - Sign up with Clerk authentication

---

## ❓ Need Help?

- Check the [README.md](file:///Users/stephniewium/Documents/CompanyNext-Cursor-Platform/README.md) for detailed documentation
- See the troubleshooting section in README
- Ensure all environment variables are correctly set in `.env`
