export const addNetwork = async (): Promise<boolean> => {
  const addNetworkRequest = window.ethereum.request<boolean>({
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
