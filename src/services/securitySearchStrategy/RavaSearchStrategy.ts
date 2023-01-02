import { SearchEngineType, SecurityType } from '@prisma/client';
import dayjs from 'dayjs';
import { ISecuritySearchStrategy } from '.';
import { SecurityPriceData, SecuritySearchResponse } from '../../interfaces/security';

const ravaPublicUrl = 'https://clasico.rava.com/lib/restapi/v3/publico/cotizaciones/historicos';

type RavaHistoricResult = {
  body: RavaPriceData[];
  count: number;
  exectime: number;
};

type RavaPriceData = {
  especie: string;
  fecha: string;
  apertura: number;
  maximo: number;
  minimo: number;
  cierre: number;
  volumen: number;
  timestamp: number;
};

export default class RavaSearchStrategy implements ISecuritySearchStrategy {
  async getDailyPrices(ticker: string, startDate?: Date): Promise<SecurityPriceData[] | null> {
    const validStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '0000-00-00';
    const prices = await this.getPrices(ticker, validStartDate);

    return prices
      ? prices.map(
          (price) =>
            <SecurityPriceData>{
              date: new Date(price.timestamp * 1000),
              open: price.apertura,
              high: price.maximo,
              low: price.minimo,
              close: price.cierre,
              volume: price.volumen,
            }
        )
      : null;
  }

  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    const startDate = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
    const prices = await this.getPrices(ticker, startDate);

    if (prices) {
      const dailyChange = prices.length > 1 ? prices[0].cierre - prices[1].cierre : undefined;
      const dailyChangePercentage = dailyChange ? dailyChange / prices[0].cierre : undefined;
      return {
        name: ticker.toUpperCase(),
        ticker: ticker.toUpperCase(),
        type: SecurityType.BOND,
        lastPrice: prices[0].cierre,
        dailyChange: dailyChange,
        dailyChangePercentage: dailyChangePercentage,
        searchEngine: SearchEngineType.RAVA_BURSATIL,
      };
    }

    return null;
  }

  private async getPrices(ticker: string, startDate: string): Promise<RavaPriceData[] | null> {
    const endDate = dayjs().format('YYYY-MM-DD');
    const pricesResult = await fetch(ravaPublicUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: `access_token=${process.env.RAVA_ACCESS_TOKEN}&especie=${ticker}&fecha_inicio=${startDate}&fecha_fin=${endDate}`,
    });

    if (pricesResult.ok) {
      const json: RavaHistoricResult = await pricesResult.json();
      const prices = json.body.sort((a, b) => b.timestamp - a.timestamp);

      return prices;
    }

    return null;
  }
}
