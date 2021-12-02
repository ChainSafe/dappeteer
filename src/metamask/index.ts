import { Page } from 'puppeteer';

import { Dappeteer } from '..';

import { addNetwork } from './addNetwork';
import { addToken } from './addToken';
import { approve } from './approve';
import { confirmTransaction } from './confirmTransaction';
import { getTokenBalance } from './getTokenBalance';
import { importPk } from './importPk';
import { lock } from './lock';
import { sign } from './sign';
import { switchAccount } from './switchAccount';
import { switchNetwork } from './switchNetwork';
import { unlock } from './unlock';

export type SetSignedIn = (state: boolean) => Promise<void>;
export type GetSingedIn = () => Promise<boolean>;

export const getMetamask = async (page: Page, version?: string): Promise<Dappeteer> => {
  // modified window object to kep state between tests
  const setSignedIn = async (state: boolean): Promise<void> => {
    await page.evaluate((s: boolean) => {
      ((window as unknown) as { signedIn: boolean }).signedIn = s;
    }, state);
  };
  const getSingedIn = (): Promise<boolean> =>
    page.evaluate(() =>
      ((window as unknown) as { signedIn: boolean | undefined }).signedIn !== undefined
        ? ((window as unknown) as { signedIn: boolean }).signedIn
        : true,
    );

  return {
    addNetwork: addNetwork(page, version),
    approve: approve(page, version),
    confirmTransaction: confirmTransaction(page, getSingedIn, version),
    importPK: importPk(page, version),
    lock: lock(page, setSignedIn, getSingedIn, version),
    sign: sign(page, getSingedIn, version),
    switchAccount: switchAccount(page, version),
    switchNetwork: switchNetwork(page, version),
    unlock: unlock(page, setSignedIn, getSingedIn, version),
    addToken: addToken(page),
    getTokenBalance: getTokenBalance(page),
    page,
  };
};
