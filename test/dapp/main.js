async function start() {
  let provider, signer, address, counterContract

  async function connect() {
    const metamask = await detectEthereumProvider()

    await ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })

    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    address = accounts[0]

    provider = await new ethers.providers.Web3Provider(metamask)
    signer = provider.getSigner()
    counterContract = new ethers.Contract(ContractInfo.address, ContractInfo.abi, signer)
  }

  const increaseButton = document.querySelector('.increase-button')
  increaseButton.addEventListener('click', async function () {
    await counterContract.increase()
    const txSent = document.createElement('div')
    txSent.id = 'txSent'
    document.body.appendChild(txSent)
  })

  const connectButton = document.querySelector('.connect-button')
  connectButton.addEventListener('click', async function () {
    await connect()

    const connected = document.createElement('div')
    connected.id = 'connected'
    document.body.appendChild(connected)
  })

  const signButton = document.querySelector('.sign-button')
  signButton.addEventListener('click', async function () {
    try {
      if (!signer) {
        await connect()
      }
      await signer.signMessage('TEST')
      const signed = document.createElement('div')
      signed.id = 'signed'
      document.body.appendChild(signed)
    } catch(error) {
      console.log(error)
    }
  })
}

start()
