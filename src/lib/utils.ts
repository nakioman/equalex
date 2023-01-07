export const nameof = <T>(name: Extract<keyof T, string>): string => name;

export const moneyFormatter = (value?: number) =>
  value ? `$ ${value.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-';
