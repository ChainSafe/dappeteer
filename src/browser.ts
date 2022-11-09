import { EventEmitter } from "events";
import { DappeteerPage } from "./page";

export interface DappeteerBrowser<Browser = unknown, Page = unknown>
  extends EventEmitter {
  isMetaMaskFlask(): boolean;

  pages(): Promise<DappeteerPage<Page>[]>;

  newPage(): Promise<DappeteerPage<Page>>;

  getSource(): Browser;

  close(): Promise<void>;

  wsEndpoint(): string;
}
