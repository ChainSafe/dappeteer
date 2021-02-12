import ganache from "ganache-core";
import Web3 from "web3";
import * as http from "http";
import * as path from "path";
import handler from "serve-handler";
import { compileContracts } from './contract';


let CounterContract: {address: string} | null = null;
let provider = null; 

export function getCounterContract(): {address: string} | null {
  return CounterContract;
}

async function deploy(): Promise<string> {
  await waitForGanache()
  await startTestServer()
  CounterContract = await deployContract();
  return CounterContract.address;
}

async function waitForGanache() {
  console.log('Starting ganache...')
  const server = ganache.server({ seed: 'asd123' })
  provider = server.provider;
  await new Promise<void>(res => {
    server.listen(8545, () => {
      console.log('Ganache running at http://localhost:8545')
      res()
    })
  })
}

async function deployContract(): Promise<{address: string} | null> {
  console.log('Deploying test contract...')
  const web3 = new Web3(provider);
  const compiledContracts = compileContracts();
  const CounterContractInfo = compiledContracts["Counter.sol"]["Counter"];
  const CounterContract = new web3.eth.Contract(CounterContractInfo.abi);
  const accounts = await web3.eth.getAccounts();
  const counterContract = await CounterContract.deploy({ data: CounterContractInfo.evm.bytecode.object }).send({ from: accounts[0], gas: 4000000 });
  console.log('Contract deployed at', counterContract.options.address);
  return {address: counterContract.options.address};
}

async function startTestServer() {
  console.log('Starting test server...')
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: path.join(__dirname, 'server'),
      cleanUrls: true
    })
  })

  await new Promise<void>(res => {
    server.listen(8080, () => {
      console.log('Server running at http://localhost:8080')
      res()
    })
  })
}

export default deploy
