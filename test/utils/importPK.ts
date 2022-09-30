import { expect } from 'chai';

import { clickOnLogo, openProfileDropdown } from '../../src/helpers';
import { metamask } from '../test.spec';
import { pause } from '../utils';

export const importPKTests = async (): Promise<void> => {
  afterEach(async () => {
    await clickOnLogo(metamask.page);
  });

  after(async () => {
    await metamask.helpers.deleteAccount(2);
    await pause(0.5);
  });

  it('should import private key', async () => {
    const countAccounts = async (): Promise<number> => {
      await openProfileDropdown(metamask.page);
      const container = await metamask.page.$('.account-menu__accounts');
      const count = (await container.$$('.account-menu__account')).length;
      await openProfileDropdown(metamask.page);
      return count;
    };

    const beforeImport = await countAccounts();
    await metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10');
    const afterImport = await countAccounts();

    expect(beforeImport + 1).to.be.equal(afterImport);
  });

  it('should throw error on duplicated private key', async () => {
    await expect(
      metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10'),
    ).to.be.rejectedWith(SyntaxError);
  });

  it('should throw error on wrong key', async () => {
    await expect(
      metamask.importPK('4f3edf983ac636a65a$@!ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10'),
    ).to.be.rejectedWith(SyntaxError);
  });

  it('should throw error on to short key', async () => {
    await expect(metamask.importPK('4f3edf983ac636a65ace7c78d9aa706d3b113bce9c46f30d7d21715b23b10')).to.be.rejectedWith(
      SyntaxError,
    );
  });
};
