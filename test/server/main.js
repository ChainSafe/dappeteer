async function start() {
    const web3 = new Web3(window.web3.currentProvider);
    console.log(web3)
    const counterContract = new web3.eth.Contract(ContractInfo.abi, ContractInfo.address);

    const increaseButton = document.querySelector(".increase-button")
    increaseButton.addEventListener('click', async function () {
        const accounts = await web3.eth.getAccounts();
        await counterContract.methods.increase().send({from: accounts[0]});
        const txSent = document.createElement("div");
        txSent.id = "txSent";
        document.body.appendChild(txSent);
    });

    const connectButton = document.querySelector(".connect-button");
    connectButton.addEventListener('click', async function () {
        await ethereum.enable();
        const connected = document.createElement("div");
        connected.id = "connected";
        document.body.appendChild(connected);
    });

    const signButton = document.querySelector(".sign-button");
    signButton.addEventListener('click', async function () {
        const accounts = await web3.eth.getAccounts();
        await web3.eth.personal.sign("TEST", accounts[0]); 
        const signed = document.createElement("div");
        signed.id = "signed";
        document.body.appendChild(signed);
    });
}

start();