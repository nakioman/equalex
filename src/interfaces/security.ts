import { SecurityType } from '@prisma/client';
import { WatchlistResponse } from './watchlist';

export type SecuritySearchResponse = Omit<WatchlistResponse, 'id' | 'type'> & {
  type?: SecurityType;
};
