export interface DappeteerElementHandle<
  Source = unknown,
  Element = HTMLElement
> {
  $$(selector: string): Promise<DappeteerElementHandle[]>;
  evaluate(fn: (e: Element) => void | Promise<void>): Promise<void>;
  type(value: string): Promise<void>;
  click(): Promise<void>;
  hover(): Promise<void>;
  getSource(): Source;
}
