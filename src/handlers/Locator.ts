import Page from './Page';
import Wrap, { type Wrappable } from './Wrap';
import config from '../config';
import type { LocatorOptions, LocatorScreenshotOptions, PWLocator } from '../types';

export default class Locator extends Wrap<PWLocator> {
  page: Page;

  constructor(locator: Locator, page?: Page);
  constructor(locator: Wrappable<Locator>, page: Page);
  constructor(locator: Locator | Wrappable<Locator>, page?: Page) {
    super(locator);
    this.page = locator instanceof Locator ? locator.page : page!;
  }

  async all() {
    return (await this.$raw.all()).map((element) => new Locator(element, this.page));
  }

  click(...args: Parameters<PWLocator['click']>) {
    return this.$raw.click(...args);
  }

  count() {
    return this.$raw.count();
  }

  evaluate<E extends SVGElement | HTMLElement, R = any>(pageFunction: string | ((element: E) => (R | Promise<R>)), options?: { timeout?: number; }): R {
    // @ts-ignore
    return this.$raw.evaluate(pageFunction, options);
  }

  fill(...args: Parameters<PWLocator['fill']>) {
    return this.$raw.fill(...args);
  }

  filter(...args: Parameters<PWLocator['filter']>) {
    return new Locator(this.$raw.filter(...args), this.page);
  }

  first() {
    return new Locator(this.$raw.first(), this.page);
  }

  getAttribute(...args: Parameters<PWLocator['getAttribute']>) {
    return this.$raw.getAttribute(...args);
  }

  getByText(...args: Parameters<PWLocator['getByText']>) {
    return new Locator(this.$raw.getByText(...args), this.page);
  }

  async isHidden(...args: Parameters<PWLocator['isHidden']>) {
    return this.$raw.isHidden(...args);
  }

  async isMissing() {
    return (await this.$raw.count()) === 0;
  }

  async isVisible(...args: Parameters<PWLocator['isVisible']>) {
    return this.$raw.isVisible(...args);
  }

  locator(selectorOrLocator: string | Wrappable<PWLocator>, options?: LocatorOptions<Wrappable<PWLocator>>) {
    return new Locator(this.$raw.locator(Wrap.unwrap(selectorOrLocator), Object.assign({}, options, {
      has: Wrap.unwrap(options?.has),
      hasNot: Wrap.unwrap(options?.hasNot),
    })), this.page);
  }

  /**
   * Open a locator in a new tab (if possible).
   * If a callback is provided, the page will be closed after execute it.
   */
  async openInNewTab(callback?: never): Promise<Page>;
  async openInNewTab<R extends unknown>(callback: (page: Page) => Promise<R> | R): Promise<R>;
  async openInNewTab<R extends unknown>(callback?: (page: Page) => Promise<R> | R): Promise<Page | R> {
    const valid = await this.$raw.evaluate((el: HTMLElement) => {
      if (((el): el is HTMLAnchorElement => el.tagName === 'A')(el)) {
        el.target = '_blank';
        return true;
      }
      return false;
    });
    if (!valid) throw new Error('Element cannot be opened in a new tab');
    const pagePromise = this.page.context.waitForPage();
    await this.click();
    const page = new Page(await pagePromise, this.page.context);
    await page.waitForLoadState('domcontentloaded');
    if (!callback) return page;
    const response = await callback(page);
    await page.close();
    return response;
  }

  parent(selector?: string) {
    const parent = this.$raw.locator('..');
    return new Locator(selector ? parent.locator(selector) : parent, this.page);
  }

  screenshot(options?: LocatorScreenshotOptions) {
    if (!config.debug) return;
    if (options?.path) options.path = `${config.screenshots}/${options.path}`;
    return this.$raw.screenshot(options);
  }

  async textContent(options?: { timeout?: number; }) {
    return (await this.$raw.textContent(options) || '').trim();
  }

  waitFor(options?: {
    state?: "attached" | "detached" | "visible" | "hidden";
    timeout?: number;
  }) {
    return this.$raw.waitFor(options);
  }
}
