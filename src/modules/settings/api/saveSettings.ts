import { AppSettingsModel } from '../../../interfaces/settings';

export async function saveSettings(userId: string, appSettings: AppSettingsModel) {
  await prisma.appSettings.upsert({
    where: { userId },
    update: {
      defaultTimeframe: appSettings.defaultTimeframe.toString(),
    },
    create: {
      defaultTimeframe: appSettings.defaultTimeframe.toString(),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
