export const nameof = <T>(name: Extract<keyof T, string>): string => name;

export const moneyFormatter = (value?: number | string) =>
  value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-';
