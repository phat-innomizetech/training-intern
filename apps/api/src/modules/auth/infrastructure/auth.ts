import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { AUTH_ERRORS, BETTER_AUTH_SECRET_MIN_LENGTH } from './auth.constants';
import { prisma } from '../../../shared/infrastructure/database/prisma';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(AUTH_ERRORS.MISSING_ENV(key));
  }
  return value;
}

const secret = requireEnv('BETTER_AUTH_SECRET');

if (secret.length < BETTER_AUTH_SECRET_MIN_LENGTH) {
  throw new Error(AUTH_ERRORS.SECRET_TOO_SHORT);
}

export const auth = betterAuth({
  secret,
  baseURL: requireEnv('BETTER_AUTH_URL'),
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});

export type Auth = typeof auth;
