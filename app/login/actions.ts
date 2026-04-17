'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export type LoginState = { error?: string };

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const callbackUrl = String(formData.get('callbackUrl') ?? '/dashboard');

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === 'CredentialsSignin') {
        return { error: 'Invalid email or password.' };
      }
      return { error: 'Authentication failed. Please try again.' };
    }
    throw err;
  }
}
