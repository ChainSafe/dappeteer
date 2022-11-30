interface Tx {
  from: string;
  to: string;
  data: string;
}

interface Params {
  tx: Tx;
}

export const sendTx = ({ tx }: Params): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return window.ethereum.request<string>({
    method: "eth_sendTransaction",
    params: [tx],
  });
};
