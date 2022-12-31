import { AssetType } from '@prisma/client';
import { SecurityResponse } from '../../interfaces/security';
import YahooFinanceSearch from './yahooSearch';

export interface ISecurityTypeSearch {
  search(ticker: string): Promise<SecurityResponse | null>;
}

export default class SecurityTypeSearch {
  protected securityType;
  constructor(type: string) {
    switch (type) {
      case AssetType.EQUITY:
        this.securityType = new YahooFinanceSearch();
        break;
      default:
        throw new Error(`SecurityTypeSearch not supported ${type}`);
    }
  }

  async search(ticker: string): Promise<SecurityResponse | null> {
    return await this.securityType.search(ticker);
  }
}
