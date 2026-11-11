export const ENV_CONFIG = {
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  DEFAULT_TIMEOUT: 10000,
  NAVIGATION_TIMEOUT: 15000,
  HEADLESS: process.env.HEADLESS !== 'false', // Default true
};

