import { chromium, firefox, webkit } from 'playwright';
import Context from './Context';
import Wrap, { type Wrappable } from './Wrap';
import type { BrowserContextOptions, LaunchOptions, PWBrowser } from '../types';

const browsers = {
  chromium,
  firefox,
  webkit,
} as const;

export type Browsers = keyof typeof browsers;

export default class Browser extends Wrap<PWBrowser> {
  constructor(browser: Wrappable<Browser>) {
    super(browser);
  }

  close(options?: { reason?: string; }) {
    return this.$raw.close(options);
  }

  static async launch(browser: Browsers, options?: LaunchOptions) {
    return new Browser(await browsers[browser].launch(options));
  }

  async newContext(options?: BrowserContextOptions) {
    return new Context(await this.$raw.newContext(options), this);
  }
}
