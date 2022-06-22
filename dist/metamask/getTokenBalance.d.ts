import { Page } from 'puppeteer';
export declare const getTokenBalance: (page: Page) => (tokenSymbol: string) => Promise<number>;
