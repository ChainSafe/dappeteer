import { Provider, Server } from "ganache";

import Web3 from "web3";
import { Dappeteer, DappeteerPage, DappeteerBrowser } from "../src";

import { Snaps, TestContract } from "./deploy";

export type InjectableContext = Readonly<{
  provider: Provider;
  ethereum: Server<"ethereum">;
  snapServers?: Record<Snaps, string>;
  browser: DappeteerBrowser;
  metaMask: Dappeteer;
  metaMaskPage: DappeteerPage;
  contract: TestContract;
  flask: boolean;
}>;

export const EXAMPLE_WEBSITE = "http://example.org";

// TestContext will be used by all the test
export type TestContext = Mocha.Context & InjectableContext;

export const LOCAL_PREFUNDED_MNEMONIC =
  "pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog";
export const PASSWORD = "password1234";

export const MESSAGE_TO_SIGN = Web3.utils.sha3("TEST"); // "0x852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46";
export const EXPECTED_MESSAGE_SIGNATURE =
  "0x727c2e31ae342588b680dfc502f0d6a7b8d0f8b9afc4ca313bdad9dca80429741f50b78c2c98ac2f18c4ec1e8fade88c8d7477766d6ceeb1f3a3ddbe7d80e90f1c";
export const EXPECTED_LONG_TYPED_DATA_SIGNATURE =
  "0x26b713388823e1b9f91cb0064bdaa0a41b3728d35fd0f6bcfdd65900d27d20a21e3d207ded1a97f928c0f3eebdd709a950b353323f32080dad7db4fc8ff8222a1c";
export const EXPECTED_SHORT_TYPED_DATA_SIGNATURE =
  "0x66996a481e09815a4400be0988a28c53b357584b15f8dba6804050b8706d5b26645695436dca610fdb9a3ad052a2c35d890e60e8ed7f25beec531743b1aa583e1b";
export const ACCOUNT_ADDRESS = "0x50707153077cFf1A48192311A12a5f905976AF14";
export const SHORT_ACCOUNT_ADDRESS = "0x507...AF14";
