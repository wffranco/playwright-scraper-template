import Context from './Context';
import Download from './Download';
import Locator from './Locator';
import Wrap, { type Wrappable } from './Wrap';
import config from '../config';
import type { LocatorOptions, PageScreenshotOptions, PWLocator, PWPage } from '../types';

export default class Page extends Wrap<PWPage> {
  context: Context;

  constructor(page: Page, context?: never);
  constructor(page: Wrappable<Page>, context: Context);
  constructor(page: Page | Wrappable<Page>, context?: Context) {
    super(page);
    this.context = page instanceof Page ? page.context : context!;
  }

  /** Current page act as an instance of the given class */
  as<P extends Page>(Class: new(page: Page) => P): P;
  as<P extends Page, Args extends unknown[]>(Class: new(page: Page, ...args: Args) => P, ...args: Args): P;
  as<P extends Page, Args extends unknown[]>(Class: new(page: Page, ...args: Args) => P, ...args: Args): P {
    return new Class(this, ...args);
  }

  click(selector: string, options?: {
    button?: "left" | "right" | "middle";
    clickCount?: number;
    delay?: number;
    force?: boolean;
    modifiers?: Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">;
    noWaitAfter?: boolean;
    position?: {
        x: number;
        y: number;
    };
    strict?: boolean;
    timeout?: number;
    trial?: boolean;
  }) {
    return this.$raw.click(selector, options);
  }

  close(options?: { reason?: string; runBeforeUnload?: boolean; }) {
    return this.$raw.close(options);
  }

  async do<R extends unknown>(callback: (page: typeof this) => Promise<R>) {
    return callback(this);
  }

  get evaluate() {
    return this.$raw.evaluate.bind(this.$raw);
  }

  fill(selector: string, value: string, options?: { force?: boolean; noWaitAfter?: boolean; strict?: boolean; timeout?: number; }) {
    return this.$raw.fill(selector, value, options);
  }

  goto(url: string, options?: {
    referer?: string;
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }) {
    if (config.baseUrl) {
      if (!url) url = config.baseUrl;
      else if (!url.startsWith('http')) url = `${config.baseUrl}/${url}`;
    }
    return this.$raw.goto(url, options);
  }

  locator(selector: string, options?: LocatorOptions<Wrappable<PWLocator>>) {
    return new Locator(this.$raw.locator(selector, Object.assign({}, options, {
      has: Wrap.unwrap(options?.has),
      hasNot: Wrap.unwrap(options?.hasNot),
    })), this);
  }

  newTab(url?: string, options?: {
    referer?: string;
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }) {
    return this.context.newPage(url ?? this.url(), options);
  }

  screenshot(options?: PageScreenshotOptions) {
    if (!config.debug) return; // Skip screenshots if not in debug mode.
    if (options?.path) options.path = `${config.screenshots}/${options.path}`;
    return this.$raw.screenshot(options);
  }

  url() {
    return this.$raw.url();
  }

  async waitForDownload(triggerer: (page: Page) => Promise<void>, callback?: never): Promise<Download>;
  async waitForDownload<R extends unknown>(triggerer: (page: Page) => Promise<void>, callback: (download: Download) => Promise<R>): Promise<R>;
  async waitForDownload<R extends unknown>(triggerer: (page: Page) => Promise<void>, callback?: (download: Download) => Promise<R>): Promise<Download | R> {
    const promise = this.$raw.waitForEvent('download');
    await triggerer(this);
    const download = new Download(await promise, this);
    return callback?.(download) ?? download;
  }

  waitForLoadState(...args: Parameters<PWPage['waitForLoadState']>) {
    return this.$raw.waitForLoadState(...args);
  }

  get waitForSelector() {
    return this.$raw.waitForSelector.bind(this.$raw);
  }

  waitForTimeout(timeout: number) {
    return this.$raw.waitForTimeout(timeout);
  }

  waitForURL(url: string | RegExp | ((url: URL) => boolean), options?: {
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }) {
    if (config.baseUrl && typeof url === 'string' && !url.startsWith('http')) {
      url = `${config.baseUrl}/${url}`;
    }
    return this.$raw.waitForURL(url, options);
  }
}
