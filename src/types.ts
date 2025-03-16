export type {
  BrowserContextOptions,
  LaunchOptions,
  LocatorScreenshotOptions,
  Browser as PWBrowser,
  BrowserContext as PWContext,
  Download as PWDownload,
  Locator as PWLocator,
  Page as PWPage,
  PageScreenshotOptions,
} from 'playwright';

export interface LocatorOptions<L> {
  has?: L;
  hasNot?: L;
  hasNotText?: string | RegExp;
  hasText?: string | RegExp;
}
