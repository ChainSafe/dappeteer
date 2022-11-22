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

  const signTypedDataButton = document.querySelector(".sign-typedData-button");
  signTypedDataButton.addEventListener("click", async function () {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: 1,
        // Give a user friendly name to the specific contract you are signing for.
        name: "Ether Mail",
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: "1",
      },

      // Defining the message signing data content.
      message: {
        /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
        contents: "Hello, Bob!",
        attachedMoneyInEth: 4.2,
        from: {
          name: "Cow",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: "Mail",
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        // Refer to PrimaryType
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        // Not an EIP712Domain definition
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    });

    var params = [accounts[0], msgParams];
    var method = "eth_signTypedData_v4";

    await window.ethereum.request({
      method,
      params,
    });

    const signed = document.createElement("div");
    signed.id = "signed-typedData";
    document.body.appendChild(signed);
  });

  const signShortTypedDataButton = document.querySelector(
    ".sign-short-typedData-button"
  );
  signShortTypedDataButton.addEventListener("click", async function () {
    const msgParams = JSON.stringify({
      domain: {
        chainId: 1,
        name: "Ether Mail",
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        version: "1",
      },

      // Defining the message signing data content.
      message: {
        contents: "Hello, Bob!",
      },
      primaryType: "Mail",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Mail: [{ name: "contents", type: "string" }],
      },
    });

    var params = [accounts[0], msgParams];
    var method = "eth_signTypedData_v4";

    await window.ethereum.request({
      method,
      params,
    });

    const signed = document.createElement("div");
    signed.id = "signed-short-typedData";
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
