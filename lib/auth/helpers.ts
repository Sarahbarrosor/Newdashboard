import { auth } from '@/auth';
import type { CountryCode } from '@/lib/constants';

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
  }
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new AuthError('Not authenticated', 401);
  return session.user;
}

export async function requireGlobalAdmin() {
  const user = await requireUser();
  if (user.role !== 'global_admin') throw new AuthError('Global admin only');
  return user;
}

export async function requireCountryWrite(country: CountryCode) {
  const user = await requireUser();
  if (user.role === 'global_admin') return user;
  if (user.role === 'country_admin' && user.countryCode === country) return user;
  throw new AuthError(`Write access denied for country ${country}`);
}

export async function canWriteCountry(country: CountryCode): Promise<boolean> {
  const session = await auth();
  const u = session?.user;
  if (!u) return false;
  return u.role === 'global_admin' || (u.role === 'country_admin' && u.countryCode === country);
}
