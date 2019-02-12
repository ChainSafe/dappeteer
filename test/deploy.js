const ganache = require("ganache-core");

const rocketh = require('rocketh');
const Web3 = require('web3');
const fs = require('fs')

const handler = require('serve-handler');
const http = require('http');
const path = require('path')

let counterContract = null;

async function deploy() {
    await waitForGanache();
    await startTestServer();
    await deployContract();

    return counterContract;
}

async function waitForGanache() {
    console.log('Starting ganache...');
    const server = ganache.server({ seed: 'asd123' });
    await new Promise(res => {
        server.listen(8545, () => {
            console.log('Ganache running at http://localhost:8545');
            res();
        });
    })
}

async function deployContract() {
    console.log('Deploying test contract...')
    const result = await rocketh.launch({ nodeUrl: 'http://localhost:8545', silent: true, rootPath: 'test' });
    const web3 = new Web3(ethereum);
    const deploymentInfo = result.deployments.Counter;
    const ContractInfo = deploymentInfo.contractInfo;
    const address = deploymentInfo.networks[result.networkId];
    counterContract = new web3.eth.Contract(ContractInfo.abi, address);
    fs.writeFileSync(path.join(__dirname, 'server/data.js'), `var ContractInfo = ${JSON.stringify({
        abi: ContractInfo.abi,
        address
    })}`)
    console.log('Contract deployed at', address);
}

async function startTestServer() {
    console.log('Starting test server...');
    const server = http.createServer((request, response) => {
        return handler(request, response, {
            public: path.join(__dirname, 'server'),
            cleanUrls: true
        });
    })

    await new Promise(res => {
        server.listen(8080, () => {
            console.log('Server running at http://localhost:8080');
            res();
        });
    })
}

module.exports = deploy