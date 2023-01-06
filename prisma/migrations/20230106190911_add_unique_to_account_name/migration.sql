/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MoneyAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MoneyAccount_name_key" ON "MoneyAccount"("name");
