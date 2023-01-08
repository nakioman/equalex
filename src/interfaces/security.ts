import { SearchEngineType, SecuritySectorType, SecurityType, TransactionType } from '@prisma/client';
import { Dayjs } from 'dayjs';

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
  id: string;
  prices: SecurityPriceData[];
  lastPriceUpdatedAt?: Date;
};

export enum SecurityChartTimeFrame {
  Month = 'Month',
  SixMonth = 'SixMonth',
  YearToDate = 'YearToDate',
  Year = 'Year',
  FiveYear = 'FiveYear',
  Max = 'Max',
}

export type SecurityTransactionRequest = {
  description?: string;
  accountId: string;
  securityId: string;
  type: TransactionType;
  openAt: Dayjs | string;
  buyPrice: number;
  quantity: number;
  closeAt?: Dayjs | string;
  closePrice?: number;
};
