export const COUNTRY_CODES = ['US', 'MX', 'CO', 'AR', 'ES'] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export const USER_ROLES = ['global_admin', 'country_admin', 'viewer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TRANSFER_STATUSES = ['pending', 'transit', 'received', 'cancelled'] as const;
export type TransferStatus = (typeof TRANSFER_STATUSES)[number];

export const COUNTRY_META: Record<CountryCode, { name: string; city: string; currency: string; flag: string }> = {
  US: { name: 'United States', city: 'Miami',        currency: 'USD', flag: '\u{1F1FA}\u{1F1F8}' },
  MX: { name: 'Mexico',        city: 'Guadalajara',  currency: 'MXN', flag: '\u{1F1F2}\u{1F1FD}' },
  CO: { name: 'Colombia',      city: 'Bogotá',       currency: 'COP', flag: '\u{1F1E8}\u{1F1F4}' },
  AR: { name: 'Argentina',     city: 'Buenos Aires', currency: 'ARS', flag: '\u{1F1E6}\u{1F1F7}' },
  ES: { name: 'Spain',         city: 'Madrid',       currency: 'EUR', flag: '\u{1F1EA}\u{1F1F8}' },
};
