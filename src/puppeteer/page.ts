import { Browser, ElementHandle, Page } from "puppeteer";
import { DappeteerBrowser } from "../browser";
import { DappeteerElementHandle } from "../element";
import { DappeteerPage, Response, Serializable, Unboxed } from "../page";
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

  $eval<T>(
    selector: string,
    evalFn: (e: HTMLElement) => T | Promise<T>
  ): Promise<T> {
    return this.page.$eval<T>(selector, evalFn) as Promise<T>;
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
    await this.page.reload();
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
    opts?: Partial<{ visible: boolean; timeout: number }>
  ): Promise<DappeteerElementHandle<ElementHandle<HTMLElement>>> {
    return new DPuppeteerElementHandle(
      (await this.page.waitForSelector(
        selector,
        opts
      )) as ElementHandle<HTMLElement>
    );
  }

  async waitForXPath(
    xpath: string,
    opts?: Partial<{ visible: boolean; timeout: number }>
  ): Promise<DappeteerElementHandle<ElementHandle>> {
    return new DPuppeteerElementHandle(
      await this.page.waitForXPath(xpath, opts)
    );
  }
  waitForTimeout(timeout: number): Promise<void> {
    return this.page.waitForTimeout(timeout);
  }
  evaluate<Params extends Serializable, Result>(
    evaluateFn: (params?: Unboxed<Params>) => Result | Promise<Result>,
    params?: Params
  ): Promise<Result> {
    return this.page.evaluate<typeof evaluateFn>(
      evaluateFn,
      params
    ) as Promise<Result>;
  }
}
