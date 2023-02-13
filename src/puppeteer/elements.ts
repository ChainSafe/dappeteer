import { ElementHandle } from "puppeteer";
import { DappeteerElementHandle } from "../element";

export class DPuppeteerElementHandle
  implements DappeteerElementHandle<ElementHandle<Element>>
{
  constructor(protected element: ElementHandle<Element>) {}

  async $$(selector: string): Promise<DappeteerElementHandle[]> {
    return (await this.element.$$(selector)).map(
      (e) => new DPuppeteerElementHandle(e as ElementHandle<HTMLElement>)
    );
  }

  hover(): Promise<void> {
    return this.element.hover();
  }

  evaluate(fn: (e: HTMLElement) => void | Promise<void>): Promise<void> {
    return this.element.evaluate(async (e) => await fn(e as HTMLElement));
  }
  getSource(): ElementHandle<HTMLElement> {
    return this.element as ElementHandle<HTMLElement>;
  }

  async type(value: string): Promise<void> {
    if (value === "") {
      //hack as there is no clear method in puppeteer
      await this.element.click({ clickCount: 3 });
      await this.element.press("Backspace");
    }
    return this.element.type(value);
  }
  click(): Promise<void> {
    return this.element.click();
  }
}
