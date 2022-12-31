import yahooFinance from 'yahoo-finance2';
import { ISecurityTypeSearch } from '.';
import { SecurityResponse } from '../../interfaces/security';

export default class YahooFinanceSearch implements ISecurityTypeSearch {
  async search(ticker: string): Promise<SecurityResponse | null> {
    const quote = await yahooFinance.quote(ticker);
    if (quote) {
      return {
        name: quote.longName ?? quote.shortName ?? quote.symbol,
        ticker: quote.symbol,
        type: 'EQUITY',
        dailyChange: quote.regularMarketChange,
        dailyChangePercentage: quote.regularMarketChangePercent
          ? quote.regularMarketChangePercent / 100
          : undefined,
        lastPrice: quote.regularMarketPrice,
      };
    }
    return null;
  }
}
