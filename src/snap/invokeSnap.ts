import { JSONArray, JSONObject, Page } from "puppeteer";
import { flaskOnly } from "./utils";

export async function invokeSnap<R = unknown>(
  page: Page,
  snapId: string,
  method: string,
  params: JSONArray | JSONObject = {}
): Promise<Partial<R>> {
  flaskOnly(page);
  return page.evaluate(
    async (opts: {
      snapId: string;
      method: string;
      params: JSONArray | JSONObject;
    }) => {
      return window.ethereum.request({
        method: "wallet_invokeSnap",
        params: [
          `${opts.snapId}`,
          {
            method: opts.method,
            params: opts.params,
          },
        ],
      });
    },
    { snapId, method, params }
  );
}
