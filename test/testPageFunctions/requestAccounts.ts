export const requestAccounts = (): Promise<string[]> => {
  return window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
};
