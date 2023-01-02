import { SearchEngineType } from '@prisma/client';
import { SecuritySearchResponse } from '../../interfaces/security';
import RavaSearchStrategy from './RavaSearchStrategy';
import YahooFinanceSearchStrategy from './YahooSearchStrategy';

export interface ISecuritySearchStrategy {
  search(ticker: string): Promise<SecuritySearchResponse | null>;
}

export default class SecuritySearchStrategyManager {
  protected securityType;
  constructor(searchEngine: SearchEngineType) {
    switch (searchEngine) {
      case SearchEngineType.YAHOO_FINANCE:
        this.securityType = new YahooFinanceSearchStrategy();
        break;
      case SearchEngineType.RAVA_BURSATIL:
        this.securityType = new RavaSearchStrategy();
        break;
      default:
        throw new Error(`SearchEngineType not supported ${searchEngine}`);
    }
  }

  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    return await this.securityType.search(ticker);
  }
}
