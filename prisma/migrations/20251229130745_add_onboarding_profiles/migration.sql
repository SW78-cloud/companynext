-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'VENDOR', 'PRIVATE_COMPANY', 'PUBLIC_COMPANY');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE');

-- CreateEnum
CREATE TYPE "WorkerType" AS ENUM ('PERMANENT', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "CompanySector" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" "AccountType",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- CreateTable
CREATE TABLE "IndividualProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "workerType" "WorkerType" NOT NULL,
    "currentCompany" TEXT,
    "contractHouse" TEXT,
    "placedAtClient" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndividualProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "clientsEarlyTerminationHabit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorClient" (
    "id" TEXT NOT NULL,
    "vendorProfileId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "staffCount" INTEGER NOT NULL,
    "isEarlyTerminationClient" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "sector" "CompanySector" NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyVendor" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "staffCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyVendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndividualProfile_userId_key" ON "IndividualProfile"("userId");

-- CreateIndex
CREATE INDEX "IndividualProfile_userId_idx" ON "IndividualProfile"("userId");

-- CreateIndex
CREATE INDEX "IndividualProfile_workerType_idx" ON "IndividualProfile"("workerType");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_userId_key" ON "VendorProfile"("userId");

-- CreateIndex
CREATE INDEX "VendorProfile_userId_idx" ON "VendorProfile"("userId");

-- CreateIndex
CREATE INDEX "VendorProfile_companyName_idx" ON "VendorProfile"("companyName");

-- CreateIndex
CREATE INDEX "VendorProfile_registrationNumber_idx" ON "VendorProfile"("registrationNumber");

-- CreateIndex
CREATE INDEX "VendorClient_vendorProfileId_idx" ON "VendorClient"("vendorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "CompanyProfile"("userId");

-- CreateIndex
CREATE INDEX "CompanyProfile_userId_idx" ON "CompanyProfile"("userId");

-- CreateIndex
CREATE INDEX "CompanyProfile_companyName_idx" ON "CompanyProfile"("companyName");

-- CreateIndex
CREATE INDEX "CompanyProfile_registrationNumber_idx" ON "CompanyProfile"("registrationNumber");

-- CreateIndex
CREATE INDEX "CompanyProfile_sector_idx" ON "CompanyProfile"("sector");

-- CreateIndex
CREATE INDEX "CompanyVendor_companyProfileId_idx" ON "CompanyVendor"("companyProfileId");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "User"("accountType");

-- CreateIndex
CREATE INDEX "User_onboardingStatus_idx" ON "User"("onboardingStatus");

-- AddForeignKey
ALTER TABLE "IndividualProfile" ADD CONSTRAINT "IndividualProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorClient" ADD CONSTRAINT "VendorClient_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyVendor" ADD CONSTRAINT "CompanyVendor_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
