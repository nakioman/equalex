import { SearchEngineType, SecuritySectorType, SecurityType } from '@prisma/client';

export type SecuritySearchResponse = {
  type?: SecurityType;
  name: string;
  ticker: string;
  sector?: SecuritySectorType;
  lastPrice?: number;
  dailyChange?: number;
  dailyChangePercentage?: number;
  updatedAt?: Date;
  searchEngine: SearchEngineType;
};

export type SecurityPriceData = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type SecurityResponse = SecuritySearchResponse & {
  prices: SecurityPriceData[];
};

export enum SecurityChartTimeFrame {
  Month = 'Month',
  SixMonth = '6Month',
  YearToDate = 'YearToDate',
  Year = 'Year',
  FiveYear = '5Year',
  Max = 'Max',
}
