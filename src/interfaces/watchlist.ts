import { SearchEngineType, SecuritySectorType, SecurityType } from '@prisma/client';

export type WatchlistRequest = {
  ticker: string;
  type: SecurityType;
  sector: SecuritySectorType;
  name: string;
  searchEngine: SearchEngineType;
};

export type WatchlistResponse = {
  id: string;
  name: string;
  ticker: string;
  sector?: SecuritySectorType;
  lastPrice?: number;
  dailyChange?: number;
  dailyChangePercentage?: number;
  type: SecurityType;
  updatedAt?: Date;
  searchEngine: SearchEngineType;
  lastPriceUpdatedAt?: Date;
};
