import Page from './Page';
import config from '../config';
import type { PWDownload } from '../types';
import Wrap, { Wrappable } from './Wrap';

export default class Download extends Wrap<PWDownload> {
  page: Page;

  constructor(download: Download, page?: Page);
  constructor(download: Wrappable<Download>, page: Page);
  constructor(download: Download | Wrappable<Download>, page?: Page) {
    super(download);
    this.page = download instanceof Download ? download.page : page!;
  }

  async saveAs(path: string) {
    this.$raw.saveAs(`${config.downloads}/${path || this.$raw.suggestedFilename()}`);
  }
};
