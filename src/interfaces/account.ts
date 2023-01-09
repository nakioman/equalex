import { MoneyAccountType } from '@prisma/client';
import { Dayjs } from 'dayjs';

export type AccountResponse = {
  id: string;
  name: string;
  cashAvailable?: number;
  cashInvested?: number;
  type: MoneyAccountType;
  actualInvestedValue?: number;
};

export type AccountRequest = {
  name: string;
  type: MoneyAccountType;
};

export type MoneyTransactionResponse = {
  id: string;
  description?: string;
  accountName: string;
  accountId: string;
  amount: number;
  createdAt: Date;
};

export type MoneyTransactionRequest = {
  description?: string;
  accountId: string;
  amount: number;
  createdAt: Dayjs | string;
};
