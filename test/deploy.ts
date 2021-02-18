import fs from 'fs';
import * as http from 'http';
import * as path from 'path';

import ganache from 'ganache-core';
import handler from 'serve-handler';
import Web3 from 'web3';

import { compileContracts } from './contract';

const counterContract: { address: string } | null = null;

export function getCounterContract(): { address: string } | null {
  return counterContract;
}

async function deploy(): Promise<{ address: string }> {
  const provider = await waitForGanache();
  await startTestServer();
  return await deployContract(provider);
}

async function waitForGanache(): Promise<ganache.Provider> {
  console.log('Starting ganache...');
  const server = ganache.server({ seed: 'asd123' });
  return await new Promise<ganache.Provider>((resolve) => {
    server.listen(8545, () => {
      console.log('Ganache running at http://localhost:8545');
      resolve(server.provider);
    });
  });
}

async function deployContract(provider: ganache.Provider): Promise<{ address: string } | null> {
  console.log('Deploying test contract...');
  const web3 = new Web3((provider as unknown) as Web3['currentProvider']);
  const compiledContracts = compileContracts();
  const counterContractInfo = compiledContracts['Counter.sol']['Counter'];
  const counterContractDef = new web3.eth.Contract(counterContractInfo.abi);
  const accounts = await web3.eth.getAccounts();
  const counterContract = await counterContractDef
    .deploy({ data: counterContractInfo.evm.bytecode.object })
    .send({ from: accounts[0], gas: 4000000 });
  console.log('Contract deployed at', counterContract.options.address);

  // create file data for dapp
  const dataJsPath = path.join(__dirname, 'dapp', 'data.js');
  const data = `const ContractInfo = ${JSON.stringify(
    { ...counterContractInfo, ...counterContract.options },
    null,
    2,
  )}`;
  await new Promise((resolve) => {
    fs.writeFile(dataJsPath, data, resolve);
  });
  console.log('path:', dataJsPath);

  return { ...counterContract, ...counterContract, ...counterContract.options };
}

async function startTestServer(): Promise<void> {
  console.log('Starting test server...');
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: path.join(__dirname, 'dapp'),
      cleanUrls: true,
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(8080, () => {
      console.log('Server running at http://localhost:8080');
      resolve();
    });
  });
}

export default deploy;
