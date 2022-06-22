import { Page } from 'puppeteer';
import { TransactionOptions } from '..';
import { GetSingedIn } from './index';
export declare const confirmTransaction: (page: Page, getSingedIn: GetSingedIn, version?: string) => (options?: TransactionOptions) => Promise<void>;
