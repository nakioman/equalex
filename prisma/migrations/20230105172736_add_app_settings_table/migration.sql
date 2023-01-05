-- CreateTable
CREATE TABLE "AppSettings" (
    "userId" TEXT NOT NULL,
    "defaultTimeframe" TEXT NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "AppSettings" ADD CONSTRAINT "AppSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
