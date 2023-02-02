import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import { BrowserContext, Page } from "playwright";
import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { copyUserDataFiles } from "../helpers/utils";
import { DPlaywrightPage } from "./page";

export class DPlaywrightBrowser
  extends EventEmitter
  implements DappeteerBrowser<BrowserContext, Page>
{
  constructor(
    protected browser: BrowserContext,
    protected userDataDir: string,
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
    fs.rmSync(this.userDataDir, { recursive: true, force: true });
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

  getUserDataDirPath(): string {
    return this.userDataDir;
  }

  storeUserData(destination: string): boolean {
    const location = path.resolve(destination);
    try {
      copyUserDataFiles(this.userDataDir, location);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
