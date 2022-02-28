import { Page } from 'puppeteer';

import { getElementByContent, getInputByLabel } from '../utils';

import { GetSingedIn, SetSignedIn } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const unlock = (page: Page, setSignedIn: SetSignedIn, getSingedIn: GetSingedIn, version?: string) => async (
  password = 'password1234',
): Promise<void> => {
  if (await getSingedIn()) {
    throw new Error("You can't sign in because you are already signed in");
  }
  await page.bringToFront();

  const passwordBox = await getInputByLabel(page, 'Password');
  await passwordBox.type(password);

  const unlockButton = await getElementByContent(page, 'Unlock');
  await unlockButton.click();
  await setSignedIn(true);
};
