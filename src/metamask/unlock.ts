import { Page } from 'puppeteer';

import { clickOnButton, typeOnInputField } from '../helpers';

import { GetSingedIn, SetSignedIn } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const unlock = (page: Page, setSignedIn: SetSignedIn, getSingedIn: GetSingedIn, version?: string) => async (
  password = 'password1234',
): Promise<void> => {
  if (await getSingedIn()) {
    throw new Error("You can't sign in because you are already signed in");
  }
  await page.bringToFront();

  await typeOnInputField(page, 'Password', password);
  await clickOnButton(page, 'Unlock');

  await setSignedIn(true);
};
