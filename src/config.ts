process.loadEnvFile('.env');

const { BASE_URL, DEBUG = '0', DOWNLOADS_PATH, SCREENSHOTS_PATH } = (process.env || {}) as {
  BASE_URL?: string;
  DEBUG?: string | `${number}`;
  DOWNLOADS_PATH?: string;
  SCREENSHOTS_PATH?: string;
};

export default {
  baseUrl: BASE_URL,
  debug: DEBUG === 'true' || DEBUG && parseInt(DEBUG) === 1,
  downloads: DOWNLOADS_PATH || 'downloads',
  screenshots: SCREENSHOTS_PATH || 'screenshots',
};
