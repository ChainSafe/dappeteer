const rocketh = require('rocketh');
const Web3 = require('web3');
const web3 = new Web3(ethereum);

module.exports = async ({ accounts, registerArtifact }) => {
    const CounterContractInfo = rocketh.contractInfo('Counter');
    const CounterContract = new web3.eth.Contract(CounterContractInfo.abi);
    const counterContract = await CounterContract.deploy({ data: CounterContractInfo.evm.bytecode.object }).send({ from: accounts[0], gas: 4000000 });
    registerArtifact('Counter', counterContract, {
        contractInfo: CounterContractInfo,
        arguments,
        address: counterContract.options.address
    });
};