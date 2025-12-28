/*
  Warnings:

  - The values [APPROVED] on the enum `ReviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewStatus_new" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED', 'REMOVED');
ALTER TABLE "public"."Review" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Review" ALTER COLUMN "status" TYPE "ReviewStatus_new" USING ("status"::text::"ReviewStatus_new");
ALTER TYPE "ReviewStatus" RENAME TO "ReviewStatus_old";
ALTER TYPE "ReviewStatus_new" RENAME TO "ReviewStatus";
DROP TYPE "public"."ReviewStatus_old";
ALTER TABLE "Review" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- CreateTable
CREATE TABLE "CompanyReviewAggregate" (
    "companyId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalPublished" INTEGER NOT NULL DEFAULT 0,
    "last30Days" INTEGER NOT NULL DEFAULT 0,
    "avgOverall" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPayFairness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgContractFairness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgTerminationRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPaymentDiscipline" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgManagementIntegrity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallDistribution" JSONB,

    CONSTRAINT "CompanyReviewAggregate_pkey" PRIMARY KEY ("companyId")
);

-- AddForeignKey
ALTER TABLE "CompanyReviewAggregate" ADD CONSTRAINT "CompanyReviewAggregate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
