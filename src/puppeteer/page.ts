import {
  Browser,
  ElementHandle,
  EvaluateFunc,
  NodeFor,
  Page,
  WaitForOptions,
} from "puppeteer";
import { DappeteerBrowser } from "../browser";
import { DappeteerElementHandle } from "../element";
import { DappeteerPage, Response, Serializable } from "../page";
import { DPuppeteerElementHandle } from "./elements";

export class DPupeteerPage implements DappeteerPage<Page> {
  constructor(
    protected page: Page,
    protected browserSource: DappeteerBrowser<Browser, Page>
  ) {}

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({
      path: path,
      fullPage: true,
    });
  }

  async $(selector: string): Promise<DappeteerElementHandle<ElementHandle>> {
    return new DPuppeteerElementHandle(await this.page.$(selector));
  }

  $eval<
    Selector extends string,
    Params extends unknown[],
    Func extends EvaluateFunc<[ElementHandle<NodeFor<Selector>>, ...Params]>
  >(selector: Selector, evalFn: Func): Promise<any> {
    return this.page.$eval<Selector, unknown[], Func>(
      selector,
      evalFn
    ) as Promise<Func>;
  }

  $$eval<T>(
    selector: string,
    evalFn: (e: HTMLElement[]) => T[] | Promise<T[]>
  ): Promise<T[]> {
    return this.page.$$eval(selector, evalFn);
  }

  async $$(selector: string): Promise<DappeteerElementHandle<ElementHandle>[]> {
    return (await this.page.$$(selector)).map(
      (e) => new DPuppeteerElementHandle(e as ElementHandle<HTMLElement>)
    );
  }

  getSource(): Page {
    return this.page;
  }

  url(): string {
    return this.page.url();
  }

  browser(): DappeteerBrowser<Browser, Page> {
    return this.browserSource;
  }

  bringToFront(): Promise<void> {
    return this.page.bringToFront();
  }

  async goto(
    url: string,
    options?: {
      timeout?: number;
      waitUntil?:
        | "load"
        | "domcontentloaded"
        | "networkidle2"
        | "networkidle"
        | "commit";
    }
  ): Promise<void> {
    if (options?.waitUntil === "networkidle") {
      options.waitUntil = "networkidle2";
    }
    //@ts-expect-error
    await this.page.goto(url, options);
  }

  title(): Promise<string> {
    return this.page.title();
  }

  close(options?: { runBeforeUnload?: boolean }): Promise<void> {
    return this.page.close(options);
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: "networkidle0" });
  }

  setViewport(opts: { height: number; width: number }): Promise<void> {
    return this.page.setViewport(opts);
  }

  waitForResponse(
    urlOrPredicate: string | ((res: Response) => boolean | Promise<boolean>),
    options?: { timeout?: number }
  ): Promise<Response> {
    return this.page.waitForResponse(urlOrPredicate, options);
  }

  async waitForSelector(
    selector: string,
    opts?: Partial<{ visible: boolean; timeout: number; hidden: boolean }>
  ): Promise<DappeteerElementHandle<ElementHandle<Element>>> {
    return new DPuppeteerElementHandle(
      await this.page.waitForSelector(selector, opts)
    );
  }

  async waitForSelectorIsGone(
    selector: string,
    opts?: Partial<{ timeout: number }>
  ): Promise<void> {
    await this.page.waitForSelector(selector, {
      hidden: true,
      ...opts,
    });
  }

  async waitForXPath(
    xpath: string,
    opts?: Partial<{ visible: boolean; timeout: number }>
  ): Promise<DappeteerElementHandle<ElementHandle<Node>>> {
    return new DPuppeteerElementHandle(
      (await this.page.waitForXPath(xpath, opts)) as ElementHandle<HTMLElement>
    );
  }

  waitForTimeout(timeout: number): Promise<void> {
    return this.page.waitForTimeout(timeout);
  }

  evaluate<Params, Result>(
    evaluateFn: (params?: Params) => Result | string,
    params?: Params
  ): Promise<Result> {
    return this.page.evaluate(evaluateFn, params) as Promise<Result>;
  }

  async waitForFunction<Params extends Serializable>(
    pageFunction: () => {} | string,
    params?: Params
  ): Promise<void> {
    await this.page.waitForFunction(pageFunction, {}, params);
  }

  exposeFunction(name: string, callback: Function): Promise<void> {
    return this.page.exposeFunction(name, callback);
  }

  async waitForNavigation(options: WaitForOptions): Promise<Response | null> {
    return this.page.waitForNavigation(options);
  }

  type(
    selector: string,
    text: string,
    options?: { delay: number }
  ): Promise<void> {
    return this.page.type(selector, text, options);
  }
}
