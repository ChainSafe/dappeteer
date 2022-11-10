import fs from "fs";
import * as http from "http";
import * as path from "path";
import { exec } from "child_process";

import ganache, { Provider, Server, ServerOptions } from "ganache";
import handler from "serve-handler";
import Web3 from "web3";

import { compileContracts } from "./contract";

const counterContract: { address: string } | null = null;

export function getCounterContract(): { address: string } | null {
  return counterContract;
}

export async function startLocalEthereum(
  opts?: ServerOptions
): Promise<Server<"ethereum">> {
  console.log("Starting ganache...");
  opts = opts ?? {};
  const server = ganache.server({ ...opts, logging: { quiet: true } });
  await server.listen(8545);
  console.log("Ganache running at http://localhost:8545");
  return server;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Contract = any | null;

export async function deployContract(provider: Provider): Promise<Contract> {
  console.log("Deploying test contract...");
  const web3 = new Web3(provider as unknown as Web3["currentProvider"]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const compiledContracts = compileContracts();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const counterContractInfo = compiledContracts["Counter.sol"]["Counter"];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const counterContractDef = new web3.eth.Contract(counterContractInfo.abi);
  const accounts = await web3.eth.getAccounts();
  const counterContract = await counterContractDef
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    .deploy({ data: counterContractInfo.evm.bytecode.object })
    .send({ from: accounts[0], gas: 4000000 });
  console.log("Contract deployed at", counterContract.options.address);

  // create file data for dapp
  const dataJsPath = path.join(__dirname, "dapp", "data.js");
  const data = `const ContractInfo = ${JSON.stringify(
    { ...counterContractInfo, ...counterContract.options },
    null,
    2
  )}`;

  await new Promise((resolve) => {
    fs.writeFile(dataJsPath, data, resolve);
  });

  return { ...counterContract, ...counterContract, ...counterContract.options };
}

export async function startTestServer(): Promise<http.Server> {
  console.log("Starting test server...");
  const server = http.createServer((request, response) => {
    void handler(request, response, {
      public: path.join(__dirname, "dapp"),
      cleanUrls: true,
    });
    return;
  });

  await new Promise<void>((resolve) => {
    server.listen(8080, () => {
      console.log("Server running at http://localhost:8080");
      resolve();
    });
  });
  return server;
}

export enum Snaps {
  BASE_SNAP = "base-snap",
  KEYS_SNAP = "keys-snap",
  PERMISSIONS_SNAP = "permissions-snap",
  METHODS_SNAP = "methods-snap",
}

export async function buildSnaps(): Promise<Record<Snaps, string>> {
  return {
    [Snaps.BASE_SNAP]: await buildSnap(Snaps.BASE_SNAP),
    [Snaps.KEYS_SNAP]: await buildSnap(Snaps.KEYS_SNAP),
    [Snaps.PERMISSIONS_SNAP]: await buildSnap(Snaps.PERMISSIONS_SNAP),
    [Snaps.METHODS_SNAP]: await buildSnap(Snaps.METHODS_SNAP),
  };
}

async function buildSnap(snap: Snaps): Promise<string> {
  console.log(`Building ${snap}...`);
  await new Promise((resolve, reject) => {
    exec(`cd ./test/flask/${snap} && npx mm-snap build`, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
  return `${path.resolve("./test/flask", snap)}`;
}
