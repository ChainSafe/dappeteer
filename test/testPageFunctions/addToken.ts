import { AddTokenStatus } from "../../src/types";

export const addToken = async (
  status: typeof AddTokenStatus
): Promise<AddTokenStatus> => {
  const addTokenRequest = window.ethereum.request<AddTokenStatus>({
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

  return new Promise((resolve) => {
    addTokenRequest
      .then(() => {
        resolve(status.SUCCESS);
      })
      .catch(() => {
        resolve(status.FAIL);
      });
  });
};
