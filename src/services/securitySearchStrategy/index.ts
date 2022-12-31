import { AssetType } from '@prisma/client';
import { SecurityResponse } from '../../interfaces/security';
import YahooFinanceSearchStrategy from './YahooSearchStrategy';

export interface ISecuritySearchStrategy {
  search(ticker: string): Promise<SecurityResponse | null>;
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

  async search(ticker: string): Promise<SecurityResponse | null> {
    return await this.securityType.search(ticker);
  }
}
