export const sign = async (): Promise<string> => {
  return window.ethereum.request<string>({
    method: "eth_sign",
    params: [
      window.sharedConst.ACCOUNT_ADDRESS,
      window.sharedConst.MESSAGE_TO_SIGN,
    ],
  });
};
