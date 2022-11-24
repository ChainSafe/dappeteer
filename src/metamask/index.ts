import { Dappeteer } from "..";
import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";

import { acceptDialog } from "../snap/acceptDialog";
import { rejectDialog } from "../snap/rejectDialog";
import { getAllNotifications, installSnap, invokeSnap } from "../snap";
import { acceptAddNetwork, rejectAddNetwork } from "./addNetwork";
import { approve } from "./approve";
import { confirmTransaction } from "./confirmTransaction";
import { deleteAccount, deleteNetwork, getTokenBalance } from "./helpers";
import { importPk } from "./importPk";
import { lock } from "./lock";
import { sign } from "./sign";
import { signTypedData } from "./signTypedData";
import { switchAccount } from "./switchAccount";
import { switchNetwork } from "./switchNetwork";
import { unlock } from "./unlock";
import { acceptAddToken, rejectAddToken } from "./addToken";

export type SetSignedIn = (state: boolean) => Promise<void>;
export type GetSingedIn = () => Promise<boolean>;

export const getMetaMask = (page: DappeteerPage): Promise<Dappeteer> => {
  // modified window object to kep state between tests
  const setSignedIn = async (state: boolean): Promise<void> => {
    const evaluateFn = (s: boolean): void => {
      (window as unknown as { signedIn: boolean }).signedIn = s;
    };
    await page.evaluate(evaluateFn, state);
  };
  const getSingedIn = (): Promise<boolean> => {
    const evaluateFn = (): boolean =>
      (window as unknown as { signedIn: boolean | undefined }).signedIn !==
      undefined
        ? (window as unknown as { signedIn: boolean }).signedIn
        : true;
    return page.evaluate(evaluateFn);
  };

  return new Promise<Dappeteer>((resolve) => {
    resolve({
      acceptAddNetwork: acceptAddNetwork(page),
      rejectAddNetwork: rejectAddNetwork(page),
      approve: approve(page),
      confirmTransaction: confirmTransaction(page, getSingedIn),
      importPK: importPk(page),
      lock: lock(page, setSignedIn, getSingedIn),
      sign: sign(page, getSingedIn),
      signTypedData: signTypedData(page, getSingedIn),
      switchAccount: switchAccount(page),
      switchNetwork: switchNetwork(page),
      unlock: unlock(page, setSignedIn, getSingedIn),
      acceptAddToken: acceptAddToken(page),
      rejectAddToken: rejectAddToken(page),
      helpers: {
        getTokenBalance: getTokenBalance(page),
        deleteAccount: deleteAccount(page),
        deleteNetwork: deleteNetwork(page),
      },
      snaps: {
        getAllNotifications: getAllNotifications(page),
        acceptDialog: acceptDialog(page),
        rejectDialog: rejectDialog(page),
        invokeSnap,
        installSnap: installSnap(page),
      },
      page,
    });
  });
};

/**
 * Return MetaMask instance
 * */
export async function getMetaMaskWindow(
  browser: DappeteerBrowser
): Promise<Dappeteer> {
  const metaMaskPage = await new Promise<DappeteerPage>((resolve, reject) => {
    browser
      .pages()
      .then((pages) => {
        for (const page of pages) {
          if (page.url().includes("chrome-extension")) resolve(page);
        }
        reject("Metamask extension not found");
      })
      .catch((e) => reject(e));
  });

  return getMetaMask(metaMaskPage);
}
