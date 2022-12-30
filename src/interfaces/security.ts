import { AssetType, Sector } from '@prisma/client';

export type SecurityResponse = {
  name: string;
  ticker: string;
  sector: SecuritySectorType;
  lastPrice?: number;
  dailyChange?: number;
  dailyChangePercentage?: number;
  type: SecurityType;
  updatedAt?: Date;
};

export type SecuritySectorType = typeof Sector[keyof typeof Sector];

export type SecurityType = typeof AssetType[keyof typeof AssetType];
