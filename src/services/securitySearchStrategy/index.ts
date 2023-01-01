import { SecurityType } from '../../interfaces/enums';
import { SecuritySearchResponse } from '../../interfaces/security';
import RavaSearchStrategy from './RavaSearchStrategy';
import YahooFinanceSearchStrategy from './YahooSearchStrategy';

export interface ISecuritySearchStrategy {
  search(ticker: string): Promise<SecuritySearchResponse | null>;
}

export default class SecuritySearchStrategyManager {
  protected securityType;
  constructor(type: string) {
    switch (type) {
      case SecurityType.EQUITY:
        this.securityType = new YahooFinanceSearchStrategy();
        break;
      case SecurityType.BOND:
        this.securityType = new RavaSearchStrategy();
        break;
      default:
        throw new Error(`SecurityTypeSearch not supported ${type}`);
    }
  }

  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    return await this.securityType.search(ticker);
  }
}
