import fs from "fs";
import http from "http";
import { MetaMaskInpageProvider } from "@metamask/providers";
import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  profileDropdownClick,
} from "../helpers";
import { DappeteerPage } from "../page";
import { EXAMPLE_WEBSITE } from "../../test/constant";
import { startSnapServer, toUrl } from "./install-utils";
import { flaskOnly } from "./utils";
import { InstallSnapResult } from "./types";

declare let window: { ethereum: MetaMaskInpageProvider };

export type InstallStep = (page: DappeteerPage) => Promise<void>;

export type InstallSnapOptions = {
  hasPermissions: boolean;
  hasKeyPermissions: boolean;
  customSteps?: InstallStep[];
  version?: string;
  installationSnapUrl?: string;
};

export const installSnap =
  (flaskPage: DappeteerPage) =>
  async (
    snapIdOrLocation: string,
    opts: InstallSnapOptions
  ): Promise<string> => {
    flaskOnly(flaskPage);
    //need to open page to access window.ethereum
    const installPage = await flaskPage.browser().newPage();
    await installPage.goto(opts.installationSnapUrl ?? EXAMPLE_WEBSITE);
    let snapServer: http.Server | undefined;
    if (fs.existsSync(snapIdOrLocation)) {
      //snap dist location
      snapServer = await startSnapServer(snapIdOrLocation);
      snapIdOrLocation = `local:${toUrl(snapServer.address())}`;
    }
    const installAction = installPage.evaluate(
      (opts: { snapId: string; version?: string }) =>
        window.ethereum.request<InstallSnapResult>({
          method: "wallet_enable",
          params: [
            {
              [`wallet_snap_${opts.snapId}`]: {
                version: opts.version ?? "latest",
              },
            },
          ],
        }),
      { snapId: snapIdOrLocation, version: opts.version }
    );

    await flaskPage.bringToFront();
    await flaskPage.reload();
    await clickOnButton(flaskPage, "Connect");
    if (opts.hasPermissions) {
      await clickOnButton(flaskPage, "Approve & install");
      if (opts.hasKeyPermissions) {
        await flaskPage.waitForSelector(".checkbox-label", {
          visible: true,
        });
        for await (const checkbox of await flaskPage.$$(".checkbox-label")) {
          await checkbox.click();
        }
        await clickOnButton(flaskPage, "Confirm");
      }
    } else {
      await clickOnButton(flaskPage, "Install");
    }

    for (const step of opts.customSteps ?? []) {
      await step(flaskPage);
    }

    const result = await installAction;
    await installPage.close({ runBeforeUnload: true });
    if (!(snapIdOrLocation in result.snaps)) {
      throw new Error("Failed to install snap");
    }
    snapServer.close();
    return snapIdOrLocation;
  };

export async function isSnapInstalled(
  flaskPage: DappeteerPage,
  snapId: string
): Promise<boolean> {
  await flaskPage.bringToFront();
  await profileDropdownClick(flaskPage);

  await clickOnElement(flaskPage, "Settings");
  await clickOnElement(flaskPage, "Snaps");
  let found = false;
  try {
    await flaskPage.waitForXPath(`//*[contains(text(), '${snapId}')]`, {
      timeout: 5000,
    });
    found = true;
  } catch (e) {
    found = false;
  }
  await clickOnLogo(flaskPage);
  return found;
}
