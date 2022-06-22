import { Page } from 'puppeteer';
export declare const switchNetwork: (page: Page, version?: string) => (network?: string) => Promise<void>;
