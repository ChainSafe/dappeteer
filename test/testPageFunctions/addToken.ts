export const addToken = async (): Promise<boolean> => {
  const addTokenRequest = window.ethereum.request<boolean>({
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
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
};
