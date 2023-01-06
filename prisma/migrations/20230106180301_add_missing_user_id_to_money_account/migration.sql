/*
  Warnings:

  - Added the required column `userId` to the `MoneyAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyAccount" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "MoneyAccount_userId_idx" ON "MoneyAccount"("userId");
