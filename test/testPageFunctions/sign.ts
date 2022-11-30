interface Params {
  address: string;
  message: string;
}
export const sign = async ({ address, message }: Params): Promise<string> => {
  return window.ethereum.request<string>({
    method: "eth_sign",
    params: [address, message],
  });
};
