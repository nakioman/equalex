import { SearchEngineType, SecurityType } from '@prisma/client';
import yahooFinance from 'yahoo-finance2';
import { ISecuritySearchStrategy } from '.';
import { SecurityPriceData, SecuritySearchResponse } from '../../interfaces/security';

export default class YahooFinanceSearch implements ISecuritySearchStrategy {
  async getDailyPrices(ticker: string, startDate?: Date | undefined): Promise<SecurityPriceData[] | null> {
    const prices = await yahooFinance.historical(ticker, {
      period1: startDate ?? 0,
    });

    return prices
      .map(
        (historical) =>
          <SecurityPriceData>{
            close: historical.close,
            date: historical.date,
            high: historical.high,
            low: historical.low,
            open: historical.open,
            volume: historical.volume,
          }
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    const quote = await yahooFinance.quote(ticker);
    if (quote) {
      return {
        name: quote.longName ?? quote.shortName ?? quote.symbol,
        ticker: quote.symbol,
        dailyChange: quote.regularMarketChange,
        type: SecurityType.EQUITY,
        dailyChangePercentage: quote.regularMarketChangePercent ? quote.regularMarketChangePercent / 100 : undefined,
        lastPrice: quote.regularMarketPrice,
        searchEngine: SearchEngineType.YAHOO_FINANCE,
      };
    }
    return null;
  }
}
