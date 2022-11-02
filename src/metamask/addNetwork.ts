import {
  clickOnButton,
  getErrorMessage,
  openNetworkDropdown,
  typeOnInputField,
} from "../helpers";
import { AddNetwork } from "../index";
import { DappeteerPage } from "../page";

export const addNetwork =
  (page: DappeteerPage) =>
  async ({ networkName, rpc, chainId, symbol }: AddNetwork): Promise<void> => {
    await page.bringToFront();
    await openNetworkDropdown(page);
    await clickOnButton(page, "Add network");

    const responsePromise = page.waitForResponse(
      (response) => new URL(response.url()).pathname === new URL(rpc).pathname
    );

    await page.waitForTimeout(500);

    await typeOnInputField(page, "Network name", networkName);
    await typeOnInputField(page, "New RPC URL", rpc);
    await typeOnInputField(page, "Chain ID", String(chainId));
    await typeOnInputField(page, "Currency symbol", symbol);

    await responsePromise;
    await page.waitForTimeout(500);

    const errorMessage = await getErrorMessage(page);
    if (errorMessage) throw new SyntaxError(errorMessage);

    await clickOnButton(page, "Save");

    await page.waitForXPath(`//*[text() = '${networkName}']`);
    await clickOnButton(page, "Got it");
  };
