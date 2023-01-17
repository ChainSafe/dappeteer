import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import { Browser, Page } from "puppeteer";
import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { copyUserDataFiles } from "../helpers/utils";
import { DPupeteerPage } from "./page";

export class DPuppeteerBrowser
  extends EventEmitter
  implements DappeteerBrowser<Browser, Page>
{
  constructor(
    protected browser: Browser,
    protected userDataDir: string,
    protected flask: boolean = false
  ) {
    super();
    this.browser.on("targetcreated", (page) =>
      this.emit("targetcreated", page)
    );
  }

  wsEndpoint(): string {
    return this.browser.wsEndpoint();
  }

  async close(): Promise<void> {
    await this.browser.close();
    fs.rmSync(this.userDataDir, { recursive: true, force: true });
  }

  async pages(): Promise<DappeteerPage<Page>[]> {
    return (await this.browser.pages()).map<DappeteerPage<Page>>((p) => {
      return new DPupeteerPage(p, this) as DappeteerPage<Page>;
    });
  }

  async newPage(): Promise<DappeteerPage<Page>> {
    return new DPupeteerPage(
      await this.browser.newPage(),
      this
    ) as DappeteerPage<Page>;
  }

  getSource(): Browser {
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
