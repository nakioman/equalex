import { MoneyAccountType } from '@prisma/client';

export type AccountResponse = {
  id: string;
  name: string;
  cashAvailable?: number;
  cashInvested?: number;
  dailyChange?: number;
  dailyChangePercent?: number;
};

export type AccountRequest = {
  name: string;
  type: MoneyAccountType;
};
