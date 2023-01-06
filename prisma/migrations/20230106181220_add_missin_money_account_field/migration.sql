/*
  Warnings:

  - Added the required column `cashAvailable` to the `MoneyAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyAccount" ADD COLUMN     "cashAvailable" DECIMAL(65,30) NOT NULL;
