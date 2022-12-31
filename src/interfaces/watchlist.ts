import { SecuritySectorType, SecurityType } from './enums';

export type WatchlistRequest = {
  ticker: string;
  type: SecurityType;
  sector: SecuritySectorType;
};
