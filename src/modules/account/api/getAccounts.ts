import { Decimal } from '@prisma/client/runtime';
import { AccountResponse } from '../../../interfaces/account';
import prisma from '../../../lib/prisma';

export async function getAccounts(userId: string): Promise<AccountResponse[]> {
  const acocunts = await prisma.moneyAccount.findMany({
    where: {
      userId,
    },
    include: {
      securityTransaction: {
        where: {
          closePrice: null,
        },
        include: {
          security: {
            include: {
              dailyHistoricalPrices: {
                take: 1,
                orderBy: {
                  date: 'desc',
                },
              },
            },
          },
        },
      },
    },
  });

  if (!acocunts) return [];

  return acocunts?.map((record) => {
    const buyPrices: Decimal.Value[] = record.securityTransaction?.map((s) => s.buyPrice ?? 0);
    const actualPrices: Decimal.Value[] = record.securityTransaction?.map((s) =>
      s.security.dailyHistoricalPrices.length > 0 ? s.security.dailyHistoricalPrices[0].close : 0
    );
    const actualCashInvested = Decimal.sum(...actualPrices).toNumber();
    const cashInvested = Decimal.sum(...buyPrices).toNumber();
    const daliyChange = actualCashInvested - cashInvested;
    return <AccountResponse>{
      id: record.id,
      name: record.name,
      cashAvailable: record.cashAvailable.toNumber(),
      cashInvested: actualCashInvested,
      dailyChange: daliyChange,
      dailyChangePercent: daliyChange > 0 ? daliyChange / actualCashInvested : 0,
    };
  });
}
