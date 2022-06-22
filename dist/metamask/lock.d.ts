import { Page } from 'puppeteer';
import { GetSingedIn, SetSignedIn } from './index';
export declare const lock: (page: Page, setSignedIn: SetSignedIn, getSingedIn: GetSingedIn, version?: string) => () => Promise<void>;
