import { ElementHandle } from "playwright";
import { DappeteerElementHandle } from "../element";

export class DPlaywrightElementHandle
  implements DappeteerElementHandle<ElementHandle<HTMLElement>>
{
  constructor(protected element: ElementHandle<HTMLElement>) {}

  async $$(
    selector: string
  ): Promise<DappeteerElementHandle<unknown, HTMLElement>[]> {
    return (await this.element.$$(selector)).map(
      (e) => new DPlaywrightElementHandle(e as ElementHandle<HTMLElement>)
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
    if (value === "") {
      return this.element.fill("");
    }
    return this.element.type(value);
  }
  click(): Promise<void> {
    return this.element.click({
      force: true,
    });
  }
}
