import { AssetType, Sector } from '@prisma/client';

export const SecuritySectorType = Sector;
export type SecuritySectorType = typeof Sector[keyof typeof Sector];

export const SecurityType = AssetType;
export type SecurityType = typeof AssetType[keyof typeof AssetType];
