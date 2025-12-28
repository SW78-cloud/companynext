-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "authorRoleSnapshot" TEXT,
ADD COLUMN     "redactedText" TEXT,
ADD COLUMN     "roleType" TEXT;
