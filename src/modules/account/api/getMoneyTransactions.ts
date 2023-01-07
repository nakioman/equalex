import { MoneyTransactionResponse } from '../../../interfaces/account';
import prisma from '../../../lib/prisma';

export async function getMoneyTransactions(userId: string): Promise<MoneyTransactionResponse[]> {
  const transactions = await prisma.moneyTransaction.findMany({
    where: {
      userId,
    },
    include: {
      account: true,
    },
  });

  if (!transactions) return [];

  return transactions.map(
    (t) =>
      <MoneyTransactionResponse>{
        accountId: t.accountId,
        accountName: t.account.name,
        amount: t.amount.toNumber(),
        createdAt: t.createdAt,
        id: t.id,
        description: t.description,
      }
  );
}
