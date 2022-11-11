import { DappeteerPage, Serializable, Unboxed } from "../page";
import { flaskOnly } from "./utils";

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
    async (opts: { snapId: string; method: string; params: Unboxed<P> }) => {
      try {
        return await window.ethereum.request<R>({
          method: "wallet_invokeSnap",
          params: [
            `${opts.snapId}`,
            {
              method: opts.method,
              params: opts.params,
            },
          ],
        });
      } catch (e) {
        return e as Error;
      }
    },
    { snapId, method, params }
  );
  if (result instanceof Error) {
    throw result;
  } else {
    return result;
  }
}
