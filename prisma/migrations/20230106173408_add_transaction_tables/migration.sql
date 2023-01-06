-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "MoneyAccountType" AS ENUM ('SAVINGS', 'INVESTMENT');

-- CreateTable
CREATE TABLE "MoneyAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MoneyAccountType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoneyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyTransaction" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "accountId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoneyTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityTransaction" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "accountId" TEXT NOT NULL,
    "securityId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "openAt" TIMESTAMP(3) NOT NULL,
    "buyPrice" DECIMAL(65,30),
    "quantity" INTEGER NOT NULL,
    "closeAt" TIMESTAMP(3),
    "closePrice" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MoneyTransaction_accountId_idx" ON "MoneyTransaction"("accountId");

-- CreateIndex
CREATE INDEX "SecurityTransaction_accountId_idx" ON "SecurityTransaction"("accountId");

-- CreateIndex
CREATE INDEX "SecurityTransaction_securityId_idx" ON "SecurityTransaction"("securityId");

-- AddForeignKey
ALTER TABLE "MoneyTransaction" ADD CONSTRAINT "MoneyTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityTransaction" ADD CONSTRAINT "SecurityTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityTransaction" ADD CONSTRAINT "SecurityTransaction_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "Security"("id") ON DELETE CASCADE ON UPDATE CASCADE;
