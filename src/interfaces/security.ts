import { WatchlistResponse } from './watchlist';

export type SecuritySearchResponse = Omit<WatchlistResponse, 'id'>;
