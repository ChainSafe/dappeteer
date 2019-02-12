async function start() {
    const web3 = new Web3(window.web3.currentProvider);
    console.log(web3)
    const counterContract = new web3.eth.Contract(ContractInfo.abi, ContractInfo.address);
    const accounts = await web3.eth.getAccounts();

    const increaseButton = document.querySelector(".increase-button")
    increaseButton.addEventListener('click', function () {
        counterContract.methods.increase().send({
            from: accounts[0]
        }).then(res => {
            console.log('success', res)
        }).catch(err => {
            console.log('fail', err)
        })
    })
}

start();