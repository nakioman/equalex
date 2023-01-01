import { AssetType } from '@prisma/client';
import { SecuritySearchResponse } from '../../interfaces/security';
import YahooFinanceSearchStrategy from './YahooSearchStrategy';

export interface ISecuritySearchStrategy {
  search(ticker: string): Promise<SecuritySearchResponse | null>;
}

export default class SecuritySearchStrategyManager {
  protected securityType;
  constructor(type: string) {
    switch (type) {
      case AssetType.EQUITY:
        this.securityType = new YahooFinanceSearchStrategy();
        break;
      default:
        throw new Error(`SecurityTypeSearch not supported ${type}`);
    }
  }

  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    return await this.securityType.search(ticker);
  }
}
