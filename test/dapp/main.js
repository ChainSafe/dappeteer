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
}

start();
