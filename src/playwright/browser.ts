import { EventEmitter } from "events";
import fs from "fs";
import { BrowserContext, Page } from "playwright";
import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { DPlaywrightPage } from "./page";

export class DPlaywrightBrowser
  extends EventEmitter
  implements DappeteerBrowser<BrowserContext, Page>
{
  constructor(
    protected browser: BrowserContext,
    protected tmpDir: string,
    protected flask: boolean = false
  ) {
    super();
    this.browser.on("page", (page) => this.emit("targetcreated", page));
  }
  wsEndpoint(): string {
    return "";
  }

  async close(): Promise<void> {
    await this.browser.close();
    fs.rmSync(this.tmpDir, { recursive: true, force: true });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async pages(): Promise<DappeteerPage<Page>[]> {
    return this.browser.pages().map<DappeteerPage<Page>>((p) => {
      return new DPlaywrightPage(p, this) as DappeteerPage<Page>;
    });
  }
  async newPage(): Promise<DappeteerPage<Page>> {
    return new DPlaywrightPage(
      await this.browser.newPage(),
      this
    ) as DappeteerPage<Page>;
  }

  getSource(): BrowserContext {
    return this.browser;
  }

  isMetaMaskFlask(): boolean {
    return this.flask;
  }
}
