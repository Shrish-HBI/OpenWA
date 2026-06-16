type EnvConfig = Record<string, unknown>;

/**
 * Fail-fast environment validation. Wired as ConfigModule's `validate`
 * callback so a misconfigured deployment is rejected at BOOT instead of silently
 * failing on the first query. Hand-rolled to avoid adding a `joi` dependency.
 *   - PORT / REDIS_PORT must be valid integer ports
 */
export function validateEnv(config: EnvConfig): EnvConfig {
  const errors: string[] = [];

  const str = (key: string): string | undefined => {
    const value = config[key];
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
  };

  const checkPort = (key: string): void => {
    const raw = str(key);
    if (raw === undefined) return;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
      errors.push(`${key} must be an integer port in [1, 65535] (got "${raw}")`);
    }
  };
  checkPort('PORT');
  checkPort('REDIS_PORT');

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n  - ${errors.join('\n  - ')}`);
  }

  return config;
}
