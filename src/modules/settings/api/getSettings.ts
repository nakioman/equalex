import { SecurityChartTimeFrame } from '../../../interfaces/security';
import { AppSettingsModel } from '../../../interfaces/settings';
import prisma from '../../../lib/prisma';

export async function getSettings(userId: string): Promise<AppSettingsModel | undefined> {
  const settings = await prisma.appSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!settings) return undefined;

  return {
    defaultTimeframe: settings.defaultTimeframe as SecurityChartTimeFrame,
  };
}
