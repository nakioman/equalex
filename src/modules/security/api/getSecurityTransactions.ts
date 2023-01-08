import dayjs from 'dayjs';
import { SecurityTransactionResponse } from '../../../interfaces/security';
import prisma from '../../../lib/prisma';

export async function getSecurityTransaction(id: string): Promise<SecurityTransactionResponse | undefined> {
  const transaction = await prisma.securityTransaction.findUnique({
    where: {
      id,
    },
    include: {
      security: true,
      account: true,
    },
  });

  if (!transaction) return undefined;

  return parseTransaction(transaction);
}

export async function getSecurityTransactions(userId: string): Promise<SecurityTransactionResponse[]> {
  const transactions = await prisma.securityTransaction.findMany({
    where: {
      userId,
    },
    include: {
      security: true,
      account: true,
    },
  });

  if (!transactions) return [];

  return transactions.map(parseTransaction);
}

function parseTransaction(record: any): SecurityTransactionResponse {
  console.log(record);
  const totalInvested = record.buyPrice?.mul(record.quantity).toNumber() ?? 0;
  const totalInvestmentClose = record.closeAt ? record.closePrice?.mul(record.quantity).toNumber() : undefined;
  const gain = totalInvestmentClose
    ? totalInvestmentClose - totalInvested
    : record.security.lastPrice?.mul(record.quantity).minus(totalInvested).toNumber();

  return <SecurityTransactionResponse>{
    id: record.id,
    ticker: record.security.ticker,
    securityName: record.security.name,
    securityId: record.security.id,
    openAt: record.openAt,
    buyPrice: record.buyPrice?.toNumber(),
    quantity: record.quantity.toNumber(),
    closeAt: record.closeAt,
    closePrice: record.closePrice?.toNumber(),
    description: record.description,
    daysOpen: record.closeAt ? dayjs(record.closeAt).diff(record.openAt, 'days') : undefined,
    securityActualValue: !record.closeAt ? record.security.lastPrice?.toNumber() : undefined,
    totalInvested,
    totalInvestmentClose,
    gain,
    gainPercentage: gain ? gain / totalInvested : '-',
    moneyAccountName: record.account.name,
    moneyAccountId: record.account.id,
    type: record.type,
  };
}
