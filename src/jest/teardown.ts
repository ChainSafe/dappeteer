export default async function (): Promise<void> {
  // close the browser instance
  await global.browser.close();
}
