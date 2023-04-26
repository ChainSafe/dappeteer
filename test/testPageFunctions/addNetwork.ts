export const addNetwork = async (): Promise<boolean> => {
  const addNetworkRequest = window.ethereum.request<boolean>({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x539",
        chainName: "Localhost 8545",
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH", // 2-6 characters long
          decimals: 18,
        },
        rpcUrls: ["http://localhost:8545"],
      },
    ],
  });

  return new Promise((resolve) => {
    addNetworkRequest
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
};
