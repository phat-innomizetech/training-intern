import { betterAuth } from 'better-auth';
import { AUTH_ERRORS, BETTER_AUTH_SECRET_MIN_LENGTH } from './auth.constants';

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
  // database adapter will be configured in subtask 2
});

export type Auth = typeof auth;
