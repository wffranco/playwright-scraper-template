import Browser, { Browsers } from './Browser';
import Page from './Page';
import Wrap, { type Wrappable } from './Wrap';
import type { BrowserContextOptions, PWContext, PWPage } from '../types';

export default class Context extends Wrap<PWContext> {
  browser: Browser;

  constructor(context: Context, browser?: Browser);
  constructor(context: Wrappable<Context>, browser: Browser);
  constructor(context: Context | Wrappable<Context>, browser?: Browser) {
    super(context);
    this.browser = context instanceof Context ? context.browser : browser!;
  }

  /** Launch a new browser instance, and start a new Context on it. */
  static async launch(browser: Browsers) {
    const instance = await Browser.launch(browser);
    return instance.newContext();
  }

  /** Create a new Context on the same browser. */
  async newContext(options?: BrowserContextOptions) {
    return new Context(await this.browser.newContext(options), this.browser);
  }

  async newPage(url?: string, options?: {
    referer?: string;
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }) {
    const page = new Page(await this.$raw.newPage(), this);
    if (url) await page.goto(url, options ?? { waitUntil: 'domcontentloaded' });
    return page;
  }

  waitForPage(optionsOrPredicate?: ((page: PWPage) => boolean | Promise<boolean>) | {
    predicate?: (page: PWPage) => boolean | Promise<boolean>;
    timeout?: number;
  }) {
    return this.$raw.waitForEvent('page', optionsOrPredicate);
  }
}
