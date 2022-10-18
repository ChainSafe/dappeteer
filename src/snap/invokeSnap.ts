import { Page } from "puppeteer";
import { SnapInstallationParamNames } from "../types";
import { flaskOnly } from "./utils";

export async function invokeSnap(
  page: Page,
  snapId: string,
  method: string,
  params: Record<SnapInstallationParamNames, any> = {}
): Promise<Partial<any>> {
  flaskOnly(page);
  return page.evaluate(
    async (opts: {
      snapId: string;
      method: string;
      params: Record<SnapInstallationParamNames, any>;
    }) => {
      return window.ethereum.request({
        method: "wallet_invokeSnap",
        params: [
          `${opts.snapId}`,
          {
            method: opts.method,
            ...opts.params,
          },
        ],
      });
    },
    { snapId, method, params }
  );
}
