import { AddNetworkStatus } from "../../src/types";

export const addNetwork = async (
  status: typeof AddNetworkStatus
): Promise<AddNetworkStatus> => {
  const addNetworkRequest = window.ethereum.request({
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
        resolve(status.SUCCESS);
      })
      .catch(() => {
        resolve(status.FAIL);
      });
  });
};
