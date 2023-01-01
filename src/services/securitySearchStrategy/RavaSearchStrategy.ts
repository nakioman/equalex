import dayjs from 'dayjs';
import { ISecuritySearchStrategy } from '.';
import { SecurityType } from '../../interfaces/enums';
import { SecuritySearchResponse } from '../../interfaces/security';

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
  async search(ticker: string): Promise<SecuritySearchResponse | null> {
    const startDate = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
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

      const dailyChange = prices.length > 1 ? prices[0].cierre - prices[1].cierre : undefined;
      const dailyChangePercentage = dailyChange ? dailyChange / prices[0].cierre : undefined;
      return {
        name: ticker.toUpperCase(),
        ticker: ticker.toUpperCase(),
        type: SecurityType.BOND,
        lastPrice: prices[0].cierre,
        dailyChange: dailyChange,
        dailyChangePercentage: dailyChangePercentage,
      };
    }

    return null;
  }
}
