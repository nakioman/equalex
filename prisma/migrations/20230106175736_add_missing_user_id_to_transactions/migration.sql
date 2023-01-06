/*
  Warnings:

  - Added the required column `userId` to the `MoneyTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SecurityTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyTransaction" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SecurityTransaction" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "MoneyTransaction_userId_idx" ON "MoneyTransaction"("userId");

-- CreateIndex
CREATE INDEX "SecurityTransaction_userId_idx" ON "SecurityTransaction"("userId");
