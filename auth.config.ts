import type { NextAuthConfig } from 'next-auth';
import type { CountryCode, UserRole } from '@/lib/constants';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      countryCode: CountryCode | null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    countryCode: CountryCode | null;
  }
}

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: UserRole }).role;
        token.countryCode = (user as { countryCode: CountryCode | null }).countryCode;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.countryCode = token.countryCode;
      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const publicPaths = ['/login', '/api/auth', '/prototype'];
      const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
      if (isPublic) return true;
      return !!auth;
    },
  },
} satisfies NextAuthConfig;
