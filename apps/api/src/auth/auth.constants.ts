export const BETTER_AUTH_SECRET_MIN_LENGTH = 10;

export const AUTH_ERRORS = {
  MISSING_ENV: (key: string) => `Missing required environment variable: ${key}`,
  SECRET_TOO_SHORT: `BETTER_AUTH_SECRET must be at least ${BETTER_AUTH_SECRET_MIN_LENGTH} characters`,
} as const;
