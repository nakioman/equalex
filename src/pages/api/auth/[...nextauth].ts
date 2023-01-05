import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { SecurityChartTimeFrame } from '../../../interfaces/security';
import prisma from '../../../lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  events: {
    createUser: async (message) => {
      await prisma.appSettings.create({
        data: {
          userId: message.user.id,
          defaultTimeframe: SecurityChartTimeFrame.SixMonth,
        },
      });
    },
  },
};

export default NextAuth(authOptions);
