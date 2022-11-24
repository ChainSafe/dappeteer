import { BrowserContext, ElementHandle, Page } from "playwright";
import { DappeteerBrowser } from "../browser";
import { DappeteerElementHandle } from "../element";
import { DappeteerPage, Response, Unboxed } from "../page";
import { DPlaywrightElementHandle } from "./elements";

export class DPlaywrightPage implements DappeteerPage<Page> {
  constructor(
    protected page: Page,
    protected browserSource: DappeteerBrowser<BrowserContext, Page>
  ) {}

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({
      path: path,
      fullPage: true,
    });
  }

  async $(selector: string): Promise<DappeteerElementHandle<ElementHandle>> {
    return new DPlaywrightElementHandle(
      (await this.page.$(selector)) as ElementHandle<HTMLElement>
    );
  }

  $eval<T>(
    selector: string,
    evalFn: (e: HTMLElement) => T | Promise<T>
  ): Promise<T> {
    return this.page.$eval(selector, evalFn);
  }

  $$eval<T>(
    selector: string,
    evalFn: (e: HTMLElement[]) => T[] | Promise<T[]>
  ): Promise<T[]> {
    return this.page.$$eval(selector, evalFn);
  }

  async $$(selector: string): Promise<DappeteerElementHandle<ElementHandle>[]> {
    return (await this.page.$$(selector)).map(
      (e) => new DPlaywrightElementHandle(e as ElementHandle<HTMLElement>)
    );
  }

  getSource(): Page {
    return this.page;
  }

  url(): string {
    return this.page.url();
  }

  browser(): DappeteerBrowser<BrowserContext, Page> {
    return this.browserSource;
  }

  bringToFront(): Promise<void> {
    return this.page.bringToFront();
  }

  async goto(url: string, options: {}): Promise<void> {
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
    return this.page.setViewportSize(opts);
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
  ): Promise<DappeteerElementHandle<ElementHandle<HTMLElement>>> {
    return new DPlaywrightElementHandle(
      (await this.page.waitForSelector(selector, {
        timeout: opts?.timeout,
        state: opts?.visible ? "visible" : opts?.hidden ? "hidden" : "attached",
      })) as ElementHandle<HTMLElement>
    );
  }

  waitForXPath(
    xpath: string,
    opts?: Partial<{ visible: boolean; timeout: number }>
  ): Promise<DappeteerElementHandle<ElementHandle>> {
    return this.waitForSelector(xpath, opts);
  }
  waitForTimeout(timeout: number): Promise<void> {
    return this.page.waitForTimeout(timeout);
  }
  evaluate<Params, Result>(
    evaluateFn: (params?: Unboxed<Params>) => Result | Promise<Result>,
    params?: Params
  ): Promise<Result> {
    //@ts-expect-error
    return this.page.evaluate(evaluateFn, params);
  }
}
