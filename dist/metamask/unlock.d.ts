import { Page } from 'puppeteer';
import { GetSingedIn, SetSignedIn } from '.';
export declare const unlock: (page: Page, setSignedIn: SetSignedIn, getSingedIn: GetSingedIn, version?: string) => (password?: string) => Promise<void>;
