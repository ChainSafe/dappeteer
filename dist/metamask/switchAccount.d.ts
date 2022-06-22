import { Page } from 'puppeteer';
export declare const switchAccount: (page: Page, version?: string) => (accountNumber: number) => Promise<void>;
