import { Decimal } from '@prisma/client/runtime/library';
import { AccountResponse } from '../../../interfaces/account';
import prisma from '../../../lib/prisma';

export async function getAccounts(userId: string): Promise<AccountResponse[]> {
  const acocunts = await prisma.moneyAccount.findMany({
    where: {
      userId,
    },
    include: {
      moneyTransaction: true,
      securityTransaction: {
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
    const cashInvested = getCashInvested(record);
    const cashAvailable = getCashAvailable(record);
    const actualInvestedValue = getActualInvestedValue(record);
    return <AccountResponse>{
      id: record.id,
      name: record.name,
      cashAvailable,
      cashInvested,
      actualInvestedValue,
      type: record.type,
    };
  });
}

function getCashAvailable(record: any) {
  const cashInvested = getCashInvested(record) ?? 0;
  const moneyTransactions =
    record.moneyTransaction?.length > 0
      ? Decimal.sum(...record.moneyTransaction?.map((m: any) => m.amount))?.toNumber()
      : undefined;
  const closedGains = getClosedGains(record) ?? 0;

  return moneyTransactions ? moneyTransactions - cashInvested + closedGains : undefined;
}

function getCashInvested(record: any) {
  const cashInvested = record.securityTransaction?.map((s: any) =>
    !s.closeAt && s.buyPrice ? s.buyPrice?.mul(s.quantity).toNumber() : 0
  );
  return cashInvested.length > 0 ? Decimal.sum(...cashInvested).toNumber() : undefined;
}

function getClosedGains(record: any) {
  const closedGains = record.securityTransaction?.map((s: any) =>
    s.closeAt && s.closePrice ? s.closePrice?.mul(s.quantity).toNumber() - s.buyPrice.mul(s.quantity).toNumber() : 0
  );
  return closedGains.length > 0 ? Decimal.sum(...closedGains).toNumber() : undefined;
}

function getActualInvestedValue(record: any) {
  const actualPrices = record.securityTransaction?.map((s: any) =>
    !s.closeAt && s.security.dailyHistoricalPrices.length > 0
      ? s.security.dailyHistoricalPrices[0].close.mul(s.quantity)
      : 0
  );
  return actualPrices?.length > 0 ? Decimal.sum(...actualPrices).toNumber() : undefined;
}
