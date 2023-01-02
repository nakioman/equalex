-- CreateEnum
CREATE TYPE "SearchEngineType" AS ENUM ('YAHOO_FINANCE', 'RAVA_BURSATIL');

-- CreateEnum
CREATE TYPE "SecurityType" AS ENUM ('BOND', 'EQUITY');

-- CreateEnum
CREATE TYPE "SecuritySectorType" AS ENUM ('TECHNOLOGY', 'ARGENTINA_BOND');

-- CreateTable
CREATE TABLE "WatchList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "securityId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" "SecuritySectorType" NOT NULL,
    "lastPrice" DECIMAL(65,30),
    "dailyChange" DECIMAL(65,30),
    "type" "SecurityType" NOT NULL,
    "searchEngine" "SearchEngineType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "dailyHistoricalPricesUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceData" (
    "date" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" BIGINT NOT NULL,
    "securityId" TEXT NOT NULL,

    CONSTRAINT "PriceData_pkey" PRIMARY KEY ("date","securityId")
);

-- CreateIndex
CREATE INDEX "WatchList_userId_idx" ON "WatchList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_ticker_key" ON "Security"("ticker");

-- CreateIndex
CREATE INDEX "Security_id_idx" ON "Security"("id");

-- CreateIndex
CREATE INDEX "PriceData_securityId_date_idx" ON "PriceData"("securityId", "date");

-- AddForeignKey
ALTER TABLE "WatchList" ADD CONSTRAINT "WatchList_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "Security"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceData" ADD CONSTRAINT "PriceData_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "Security"("id") ON DELETE CASCADE ON UPDATE CASCADE;
