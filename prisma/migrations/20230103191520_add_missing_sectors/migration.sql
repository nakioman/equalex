-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SecuritySectorType" ADD VALUE 'BASIC_MATERIALS';
ALTER TYPE "SecuritySectorType" ADD VALUE 'COMMUNICATION_SERVICES';
ALTER TYPE "SecuritySectorType" ADD VALUE 'FINANCIAL';
ALTER TYPE "SecuritySectorType" ADD VALUE 'AEROSPACE';
ALTER TYPE "SecuritySectorType" ADD VALUE 'CONSUMER_DEFENSIVE';
ALTER TYPE "SecuritySectorType" ADD VALUE 'ENERGY';
ALTER TYPE "SecuritySectorType" ADD VALUE 'HEALTHCARE';
ALTER TYPE "SecuritySectorType" ADD VALUE 'REAL_STATE';
ALTER TYPE "SecuritySectorType" ADD VALUE 'UTILITIES';
ALTER TYPE "SecuritySectorType" ADD VALUE 'ELECTRONIC_ENTERTAINMENT';
