import { Page } from 'puppeteer';
import { GetSingedIn } from '.';
export declare const sign: (page: Page, getSingedIn: GetSingedIn, version?: string) => () => Promise<void>;
