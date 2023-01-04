import { SearchEngineType, SecurityType } from '@prisma/client';
import { load as cheerioLoad } from 'cheerio';
import dayjs from 'dayjs';
import { launch as puppeteerLaunch } from 'puppeteer';
import { ISecuritySearchStrategy } from '.';
import { SecurityPriceData, SecuritySearchResponse } from '../../interfaces/security';

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
  static ravaPublicUrl: string = 'https://clasico.rava.com/lib/restapi/v3/publico/cotizaciones/historicos';
  static ravaHomeUrl: string = 'https://www.rava.com';
  static accessToken?: string;

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
    if (!RavaSearchStrategy.accessToken) await this.getAccessToken();

    const endDate = dayjs().format('YYYY-MM-DD');
    const pricesResult = await fetch(RavaSearchStrategy.ravaPublicUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: `access_token=${RavaSearchStrategy.accessToken}&especie=${ticker}&fecha_inicio=${startDate}&fecha_fin=${endDate}`,
    });

    if (pricesResult.ok) {
      const json: RavaHistoricResult = await pricesResult.json();
      const prices = json.body.sort((a, b) => b.timestamp - a.timestamp);

      return prices;
    }

    if (pricesResult.status === 403) {
      RavaSearchStrategy.accessToken = undefined;
      return await this.getPrices(ticker, startDate);
    }

    return null;
  }

  private async getAccessToken() {
    const browser = await puppeteerLaunch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(RavaSearchStrategy.ravaHomeUrl);
    const content = await page.content();

    const $ = cheerioLoad(content);
    const access_token = $('#buscador-wrapper').attr('access_token');

    RavaSearchStrategy.accessToken = access_token;
  }
}
