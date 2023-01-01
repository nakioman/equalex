import yahooFinance from 'yahoo-finance2';
import { ISecuritySearchStrategy } from '.';
import { SecuritySearchResponse } from '../../interfaces/security';

export default class YahooFinanceSearch implements ISecuritySearchStrategy {
  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    const quote = await yahooFinance.quote(ticker);
    if (quote) {
      return {
        name: quote.longName ?? quote.shortName ?? quote.symbol,
        ticker: quote.symbol,
        type: 'EQUITY',
        dailyChange: quote.regularMarketChange,
        dailyChangePercentage: quote.regularMarketChangePercent ? quote.regularMarketChangePercent / 100 : undefined,
        lastPrice: quote.regularMarketPrice,
      };
    }
    return null;
  }
}
