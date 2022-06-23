import { Page } from 'puppeteer';

export const getTokenBalance = (page: Page) => async (tokenSymbol: string): Promise<number> => {
  await page.bringToFront();
  await page.waitForTimeout(1000);

  const assetListItems = await page.$$('.asset-list-item__token-button');

  for (let index = 0; index < assetListItems.length; index++) {
    const assetListItem = assetListItems[index];

    const titleAttributeValue: string = await page.evaluate((item) => item.getAttribute('title'), assetListItem);

    if (titleAttributeValue.split(' ')[1].toUpperCase() === tokenSymbol.toUpperCase()) {
      const balance = titleAttributeValue.split(' ')[0];
      return parseFloat(balance);
    }
  }

  return 0;
};
