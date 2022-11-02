import { ElementHandle } from "puppeteer";
import { DappeteerElementHandle } from "../element";

export class DPuppeteerElementHandle
  implements DappeteerElementHandle<ElementHandle<HTMLElement>>
{
  constructor(protected element: ElementHandle<HTMLElement>) {}

  async $$(
    selector: string
  ): Promise<DappeteerElementHandle<unknown, HTMLElement>[]> {
    return (await this.element.$$(selector)).map(
      (e) => new DPuppeteerElementHandle(e as ElementHandle<HTMLElement>)
    );
  }

  hover(): Promise<void> {
    return this.element.hover();
  }

  evaluate(fn: (e: HTMLElement) => void | Promise<void>): Promise<void> {
    return this.element.evaluate(async (e) => await fn(e));
  }
  getSource(): ElementHandle<HTMLElement> {
    return this.element;
  }

  type(value: string): Promise<void> {
    return this.element.type(value);
  }
  click(): Promise<void> {
    return this.element.click();
  }
}
