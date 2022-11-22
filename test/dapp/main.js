async function start() {
  let accounts = [];

  const web3 = new Web3(window.ethereum);
  console.log(web3);
  const counterContract = new web3.eth.Contract(
    ContractInfo.abi,
    ContractInfo.address
  );

  const increaseButton = document.querySelector(".increase-button");
  increaseButton.addEventListener("click", async function () {
    await counterContract.methods.increase().send({ from: accounts[0] });
    const txSent = document.createElement("div");
    txSent.id = "txSent";
    document.body.appendChild(txSent);
  });

  const increaseFeesButton = document.querySelector(".increase-fees-button");
  increaseFeesButton.addEventListener("click", async function () {
    await counterContract.methods.increase().send({ from: accounts[0] });
    const txSent = document.createElement("div");
    txSent.id = "feesTxSent";
    document.body.appendChild(txSent);
  });

  const connectButton = document.querySelector(".connect-button");
  connectButton.addEventListener("click", async function () {
    accounts = await web3.eth.requestAccounts();
    const connected = document.createElement("div");
    connected.id = "connected";
    document.body.appendChild(connected);
  });

  const signButton = document.querySelector(".sign-button");
  signButton.addEventListener("click", async function () {
    const message = web3.utils.sha3("TEST");
    await web3.eth.sign(message, accounts[0]);
    const signed = document.createElement("div");
    signed.id = "signed";
    document.body.appendChild(signed);
  });

  const transferButton = document.querySelector(".transfer-button");
  transferButton.addEventListener("click", async function () {
    await web3.eth.sendTransaction({
      to: accounts[0],
      from: accounts[0],
      value: web3.utils.toWei("0.01"),
    });
    const transfer = document.createElement("div");
    transfer.id = "transferred";
    document.body.appendChild(transfer);
  });

  const addTokenButton = document.querySelector(".add-token-button");
  addTokenButton.addEventListener("click", async function () {
    const resultElem = document.createElement("div");
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
            symbol: "KAKI",
            decimals: 18,
          },
        },
      });
      resultElem.id = "addTokenResultSuccess";
    } catch (e) {
      resultElem.id = "addTokenResultFail";
    }
    document.body.appendChild(resultElem);
  });

  const addNetworkButton = document.querySelector(".add-network-button");
  addNetworkButton.addEventListener("click", async function () {
    const resultElem = document.createElement("div");
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xa",
            chainName: "Optimism",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH", // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: ["https://mainnet.optimism.io"],
          },
        ],
      });
      resultElem.id = "addNetworkResultSuccess";
    } catch (e) {
      resultElem.id = "addNetworkResultFail";
    }
    document.body.appendChild(resultElem);
  });
}

start();
