export interface DatabaseConfig {
  readonly url: string;
  readonly ssl: boolean;
  readonly poolMin: number;
  readonly poolMax: number;
}

const DEFAULT_POOL_MIN = 2;
const DEFAULT_POOL_MAX = 10;

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseIntEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`Invalid integer for ${key}: "${raw}"`);
  }

  return parsed;
}

function parseBoolEnv(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;

  return raw === 'true' || raw === '1';
}

export function loadDatabaseConfig(): DatabaseConfig {
  const url = requireEnv('DATABASE_URL');

  const ssl = parseBoolEnv('DATABASE_SSL', true);

  const poolMin = parseIntEnv('DATABASE_POOL_MIN', DEFAULT_POOL_MIN);
  const poolMax = parseIntEnv('DATABASE_POOL_MAX', DEFAULT_POOL_MAX);

  if (poolMin > poolMax) {
    throw new Error(
      `DATABASE_POOL_MIN (${poolMin}) cannot exceed DATABASE_POOL_MAX (${poolMax})`
    );
  }

  return {
    url,
    ssl,
    poolMin,
    poolMax,
  };
}