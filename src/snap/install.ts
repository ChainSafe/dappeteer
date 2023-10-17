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
import { EXAMPLE_WEBSITE } from "../constants";
import { closePrivacyWarningModal } from "../setup/setupActions";
import { startSnapServer, toUrl } from "./install-utils";
import { flaskOnly, isFirstElementAppearsFirst } from "./utils";
import { InstallSnapResult } from "./types";

declare let window: { ethereum: MetaMaskInpageProvider };

export type InstallStep = (page: DappeteerPage) => Promise<void>;

export type InstallSnapOptions = {
  customSteps?: InstallStep[];
  version?: string;
  installationSnapUrl?: string;
};

export const installSnap =
  (flaskPage: DappeteerPage) =>
  async (
    snapIdOrLocation: string,
    opts?: InstallSnapOptions
  ): Promise<string> => {
    flaskOnly(flaskPage);
    //need to open page to access window.ethereum
    const installPage = await flaskPage.browser().newPage();
    await installPage.goto(opts?.installationSnapUrl ?? EXAMPLE_WEBSITE);
    let snapServer: http.Server | undefined;
    if (fs.existsSync(snapIdOrLocation)) {
      //snap dist location
      snapServer = await startSnapServer(snapIdOrLocation);
      snapIdOrLocation = `local:${toUrl(snapServer.address())}`;
    }
    const installAction = installPage.evaluate(
      ({ snapId, version }: { snapId: string; version?: string }) =>
        window.ethereum.request<InstallSnapResult>({
          method: "wallet_requestSnaps",
          params: {
            [snapId]: {
              version: version ?? "latest",
            },
          },
        }),
      { snapId: snapIdOrLocation, version: opts?.version }
    );

    await flaskPage.bringToFront();
    await flaskPage.reload();

    try {
      const privacyWarningModal = await flaskPage.$(
        '[data-testid="snap-privacy-warning-scroll"]'
      );
      if (privacyWarningModal) await closePrivacyWarningModal(flaskPage);
    } catch (e) {
      //ignored if modal is not present
    }

    await clickOnButton(flaskPage, "Connect");

    await flaskPage.waitForSelector(".pulse-loader", { visible: false });
    await flaskPage.waitForSelector(".snap-permissions-list");

    await clickOnButton(flaskPage, "Install");

    const isAskingForPermissions = await isFirstElementAppearsFirst({
      selectorOrXpath1: `.checkbox-label`,
      selectorOrXpath2: `.pulse-loader`,
      page: flaskPage,
    });

    if (isAskingForPermissions) {
      await flaskPage.waitForSelector(".checkbox-label", {
        visible: false,
      });
      for await (const checkbox of await flaskPage.$$(".checkbox-label")) {
        await checkbox.click();
      }

      await clickOnButton(flaskPage, "Confirm");
      await flaskPage.waitForSelector(".pulse-loader", { visible: false });
    }

    await flaskPage.waitForSelector(
      '[data-testid="page-container-footer-next"]:not([disabled])'
    );
    await clickOnButton(flaskPage, "page-container-footer-next");

    for (const step of opts?.customSteps ?? []) {
      await step(flaskPage);
    }

    const result = await installAction;
    await installPage.waitForTimeout(1000);
    await installPage.close({ runBeforeUnload: true });
    if (!(snapIdOrLocation in result)) {
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
