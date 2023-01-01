import { SecuritySectorType, SecurityType } from './enums';

export type SecurityResponse = {
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
