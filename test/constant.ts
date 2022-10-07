import http from "http";

import { Provider, Server } from "ganache";
import { Browser } from "puppeteer";

import { Dappeteer } from "../src";

import { Contract } from "./deploy";

export type InjectableContext = Readonly<{
  provider: Provider;
  ethereum: Server<"ethereum">;
  testPageServer: http.Server;
  browser: Browser;
  metamask: Dappeteer;
  contract: Contract;
  flask: boolean;
}>;

// TestContext will be used by all the test
export type TestContext = Mocha.Context & InjectableContext;

export const LOCAL_PREFUNDED_MNEMONIC =
  "pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog";
export const PASSWORD = "password1234";
