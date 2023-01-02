import { SecurityType } from '@prisma/client';
import { WatchlistResponse } from './watchlist';

export type SecuritySearchResponse = Omit<WatchlistResponse, 'id' | 'type'> & {
  type?: SecurityType;
};

export type SecurityPriceData = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};
