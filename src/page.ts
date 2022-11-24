import { DappeteerBrowser } from "./browser";
import { DappeteerElementHandle } from "./element";

export interface DappeteerPage<P = unknown> {
  $(selector: string): Promise<DappeteerElementHandle | null>;
  $eval<T>(
    selector: string,
    evalFn: (e: HTMLElement) => Promise<T> | T
  ): Promise<T>;
  $$eval<T>(
    selector: string,
    evalFn: (e: HTMLElement[]) => Promise<T[]> | T[]
  ): Promise<T[]>;
  $$(selector: string): Promise<DappeteerElementHandle[]>;
  getSource(): P;
  url(): string;
  browser(): DappeteerBrowser;
  bringToFront(): Promise<void>;
  goto(
    url: string,
    options?: {
      timeout?: number;
      waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
    }
  ): Promise<void>;
  title(): Promise<string>;
  close(options?: { runBeforeUnload?: boolean }): Promise<void>;
  reload(): Promise<void>;
  setViewport(opts: { height: number; width: number }): Promise<void>;
  waitForResponse(
    urlOrPredicate: string | ((res: Response) => boolean | Promise<boolean>),
    options?: {
      timeout?: number;
    }
  ): Promise<Response>;
  waitForSelector(
    selector: string,
    opts?: Partial<{
      visible: boolean;
      detached: boolean;
      hidden: boolean;
      timeout: number;
    }>
  ): Promise<DappeteerElementHandle>;

  waitForSelectorIsGone(
    selector: string,
    opts?: Partial<{ timeout: number }>
  ): Promise<void>;
  waitForXPath(
    xpath: string,
    opts?: Partial<{ visible: boolean; timeout: number }>
  ): Promise<DappeteerElementHandle>;
  waitForTimeout(timeout: number): Promise<void>;
  evaluate<Params extends Serializable, Result>(
    evaluateFn: (params: Unboxed<Params>) => Result,
    params?: Params
  ): Promise<Result>;
  screenshot(path: string): Promise<void>;
}

export type Unboxed<Arg> = Arg extends DappeteerElementHandle<any, infer T>
  ? T
  : Arg extends [infer A0]
  ? [Unboxed<A0>]
  : Arg extends [infer A0, infer A1]
  ? [Unboxed<A0>, Unboxed<A1>]
  : Arg extends [infer A0, infer A1, infer A2]
  ? [Unboxed<A0>, Unboxed<A1>, Unboxed<A2>]
  : Arg extends [infer A0, infer A1, infer A2, infer A3]
  ? [Unboxed<A0>, Unboxed<A1>, Unboxed<A2>, Unboxed<A3>]
  : Arg extends Array<infer T>
  ? Array<Unboxed<T>>
  : Arg extends object
  ? { [Key in keyof Arg]: Unboxed<Arg[Key]> }
  : Arg;

export declare type Serializable =
  | number
  | string
  | boolean
  | null
  | BigInt
  | Serializable[]
  | { [k: string]: Serializable };

export interface Response {
  /**
   * An object with the response HTTP headers. The header names are lower-cased. Note that this method does not return
   * security-related headers, including cookie-related ones. You can use
   * [response.allHeaders()](https://playwright.dev/docs/api/class-response#response-all-headers) for complete list of
   * headers that include `cookie` information.
   */
  headers(): { [key: string]: string };

  /**
   * Returns the JSON representation of response body.
   *
   * This method will throw if the response body is not parsable via `JSON.parse`.
   */
  json(): Promise<any>;

  /**
   * Contains a boolean stating whether the response was successful (status in the range 200-299) or not.
   */
  ok(): boolean;

  /**
   * Contains the status code of the response (e.g., 200 for a success).
   */
  status(): number;

  /**
   * Contains the status text of the response (e.g. usually an "OK" for a success).
   */
  statusText(): string;

  /**
   * Returns the text representation of response body.
   */
  text(): Promise<string>;

  /**
   * Contains the URL of the response.
   */
  url(): string;
}
