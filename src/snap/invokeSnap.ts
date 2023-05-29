import { DappeteerPage, Serializable } from "../page";
import { flaskOnly, isMetaMaskErrorObject } from "./utils";

export async function invokeSnap<
  R = unknown,
  P extends Serializable = Serializable
>(
  page: DappeteerPage,
  snapId: string,
  method: string,
  params?: P
): ReturnType<typeof window.ethereum.request<R>> {
  flaskOnly(page);

  const result = await page.evaluate(
    async (opts: { snapId: string; method: string; params: P }) => {
      try {
        return await window.ethereum.request<R>({
          method: "wallet_invokeSnap",
          params: {
            request: {
              method: opts.method,
              params: opts.params,
            },
            snapId: opts.snapId,
          },
        });
      } catch (e) {
        return e as Error;
      }
    },
    { snapId, method, params }
  );
  if (result instanceof Error || isMetaMaskErrorObject(result)) {
    throw result;
  } else {
    return result;
  }
}
