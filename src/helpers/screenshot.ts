import { writeFileSync } from 'fs';
import path from 'path';

import { Page } from 'puppeteer';

export const screenshot = async (page: Page, name: string): Promise<void> =>
  writeFileSync(
    path.resolve(__dirname, '../../', name + '.png'),
    await page.screenshot({ encoding: 'binary', fullPage: true }),
  );
