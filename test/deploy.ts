import * as path from "path";
import { exec } from "child_process";

import ganache, { EthereumProvider, Server, ServerOptions } from "ganache";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

import { compileContracts } from "./contract";
import { ContractInfo } from "./contract/contractInfo";

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

export type TestContract = Contract<typeof ContractInfo.abi>;

export async function deployContract(
  provider: EthereumProvider
): Promise<TestContract> {
  console.log("Deploying test contract...");
  const web3 = new Web3(provider);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const compiledContracts = compileContracts();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const counterContractInfo = compiledContracts["Counter.sol"]["Counter"];
  const counterContractDef = new Contract(ContractInfo.abi, web3);
  const accounts = await web3.eth.getAccounts();
  const counterContract = await counterContractDef
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    .deploy({ data: counterContractInfo.evm.bytecode.object })
    .send({ from: accounts[0], gas: "4000000" });
  console.log("Contract deployed at", counterContract.options.address);

  return counterContract;
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
