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
    const buyPrices = record.securityTransaction?.map((s) => s.buyPrice ?? 0);
    const actualPrices = record.securityTransaction?.map((s) =>
      s.security.dailyHistoricalPrices.length > 0 ? s.security.dailyHistoricalPrices[0].close : 0
    );
    const actualCashInvested = actualPrices?.length > 0 ? Decimal.sum(...actualPrices).toNumber() : undefined;
    const cashInvested = buyPrices?.length > 0 ? Decimal.sum(...buyPrices).toNumber() : undefined;
    const daliyChange = actualCashInvested && cashInvested ? actualCashInvested - cashInvested : undefined;
    return <AccountResponse>{
      id: record.id,
      name: record.name,
      cashAvailable: record.cashAvailable?.toNumber(),
      cashInvested: actualCashInvested,
      dailyChange: daliyChange,
      dailyChangePercent:
        daliyChange && actualCashInvested && actualCashInvested > 0 ? daliyChange / actualCashInvested : undefined,
    };
  });
}
