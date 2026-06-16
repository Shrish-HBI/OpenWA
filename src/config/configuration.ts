export default () => ({
  port: parseInt(process.env.PORT || '2785', 10),

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },

  // Queue configuration
  queue: {
    enabled: process.env.QUEUE_ENABLED === 'true',
  },

  // Cache configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
  },

  // Main Database configuration (always SQLite for boot config)
  database: {
    type: 'sqlite' as const,
    database: './data/main.sqlite',
    // Schema management for the auth/audit DB. Default ON (zero-config first boot).
    // Set MAIN_DATABASE_SYNCHRONIZE=false to manage schema via the main-owned migrations
    // instead (migrationsRun then creates api_keys/audit_logs).
    synchronize: process.env.MAIN_DATABASE_SYNCHRONIZE !== 'false',
    logging: process.env.DATABASE_LOGGING === 'true',
  },

  // Data Storage Database configuration (SQLite only)
  dataDatabase: {
    type: 'sqlite',
    database: process.env.DATABASE_NAME || './data/openwa.sqlite',
    synchronize: process.env.DATABASE_SYNCHRONIZE !== 'false',
    logging: process.env.DATABASE_LOGGING === 'true',
  },

  // WhatsApp engine configuration
  engine: {
    type: process.env.ENGINE_TYPE || 'whatsapp-web.js',
    puppeteer: {
      headless: process.env.PUPPETEER_HEADLESS !== 'false',
      args: (process.env.PUPPETEER_ARGS || '--no-sandbox,--disable-setuid-sandbox').split(','),
      // Optional path to a system Chromium/Chrome binary. When unset, whatsapp-web.js
      // uses Puppeteer's bundled Chromium. Required on hosts where the bundled binary
      // is missing or incompatible (Alpine, ARM, custom base images).
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    },
    sessionDataPath: process.env.SESSION_DATA_PATH || './data/sessions',
  },

  // Webhook configuration
  webhook: {
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '10000', 10),
    maxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.WEBHOOK_RETRY_DELAY || '5000', 10),
  },

  // API configuration
  api: {
    rateLimit: {
      // Short burst protection: 10 requests per second
      shortTtl: parseInt(process.env.RATE_LIMIT_SHORT_TTL || '1000', 10),
      shortLimit: parseInt(process.env.RATE_LIMIT_SHORT_LIMIT || '10', 10),
      // Medium protection: 100 requests per minute
      mediumTtl: parseInt(process.env.RATE_LIMIT_MEDIUM_TTL || '60000', 10),
      mediumLimit: parseInt(process.env.RATE_LIMIT_MEDIUM_LIMIT || '100', 10),
      // Long protection: 1000 requests per hour
      longTtl: parseInt(process.env.RATE_LIMIT_LONG_TTL || '3600000', 10),
      longLimit: parseInt(process.env.RATE_LIMIT_LONG_LIMIT || '1000', 10),
    },
  },

  // Security configuration
  security: {
    // Comma-separated IPs/CIDRs of reverse proxies whose X-Forwarded-For header
    // may be trusted for client-IP resolution. Empty by default: X-Forwarded-For
    // is ignored and the direct socket address is used, preventing spoofing of
    // the API-key allowedIps whitelist.
    trustedProxies: (process.env.TRUSTED_PROXIES || '')
      .split(',')
      .map(proxy => proxy.trim())
      .filter(Boolean),
  },

  // Storage configuration
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    localPath: process.env.STORAGE_LOCAL_PATH || './data/media',
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
    },
  },
});
