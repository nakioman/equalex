import { SecuritySectorType, SecurityType } from './enums';

export type WatchlistRequest = {
  ticker: string;
  type: SecurityType;
  sector: SecuritySectorType;
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
};
