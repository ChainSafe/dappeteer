import { expect } from 'chai';

import { clickOnLogo } from '../../src/helpers';
import { metamask } from '../test.spec';
import { pause } from '../utils';

export const addNetworkTests = async (): Promise<void> => {
  after(async () => {
    await metamask.switchNetwork('local');
    await metamask.helpers.deleteNetwork('Binance Smart Chain');
    await pause(0.5);
    await metamask.helpers.deleteNetwork('KCC Testnet');
    await pause(0.5);
  });

  it('should add network with required params and symbol and explorer', async () => {
    await metamask.addNetwork({
      networkName: 'Binance Smart Chain',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      symbol: 'BNB',
      explorer: 'https://testnet.bscscan.com',
    });

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    expect(selectedNetwork).to.be.equal('Binance Smart Chain');
  });

  it('should fail to add already added network', async () => {
    await expect(
      metamask.addNetwork({
        networkName: 'Binance Smart Chain',
        rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        chainId: 97,
        symbol: 'BNB',
        explorer: 'https://testnet.bscscan.com',
      }),
    ).to.be.rejectedWith(SyntaxError);

    await clickOnLogo(metamask.page);
  });

  it('should fail to add network with wrong chain ID', async () => {
    await expect(
      metamask.addNetwork({
        networkName: 'Optimistic Ethereum Testnet Kovan',
        rpc: 'https://kovan.optimism.io/',
        chainId: 420,
        symbol: 'KUR',
        explorer: 'https://kovan-optimistic.etherscan.io',
      }),
    ).to.be.rejectedWith(SyntaxError);

    await clickOnLogo(metamask.page);
  });

  it('should add network with symbol', async () => {
    await metamask.addNetwork({
      networkName: 'KCC Testnet',
      rpc: 'https://rpc-testnet.kcc.network',
      chainId: 322,
      symbol: 'fejk',
    });

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    expect(selectedNetwork).to.be.equal('KCC Testnet');
  });
};
