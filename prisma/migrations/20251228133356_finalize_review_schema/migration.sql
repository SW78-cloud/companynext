/*
  Warnings:

  - You are about to drop the column `authorRoleSnapshot` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `redactedText` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `roleType` on the `Review` table. All the data in the column will be lost.
  - Added the required column `employmentType` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "authorRoleSnapshot",
DROP COLUMN "redactedText",
DROP COLUMN "roleType",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'South Africa',
ADD COLUMN     "dates" JSONB,
ADD COLUMN     "employmentType" TEXT NOT NULL,
ADD COLUMN     "moderation" JSONB,
ADD COLUMN     "province" TEXT;

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");
