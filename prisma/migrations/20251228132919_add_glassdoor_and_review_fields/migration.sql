-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "externalSources" JSONB,
ADD COLUMN     "hqCity" TEXT,
ADD COLUMN     "hqCountry" TEXT DEFAULT 'South Africa';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "abuseSignals" JSONB,
ADD COLUMN     "authorRoleSnapshot" TEXT,
ADD COLUMN     "body" TEXT,
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "flags" JSONB,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "GlassdoorCache" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlassdoorCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlassdoorCache_companyId_key" ON "GlassdoorCache"("companyId");

-- CreateIndex
CREATE INDEX "GlassdoorCache_expiresAt_idx" ON "GlassdoorCache"("expiresAt");

-- AddForeignKey
ALTER TABLE "GlassdoorCache" ADD CONSTRAINT "GlassdoorCache_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
