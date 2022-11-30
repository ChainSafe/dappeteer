interface Params {
  address: string;
}

export const signShortTypedData = async ({
  address,
}: Params): Promise<unknown> => {
  const msgParams = JSON.stringify({
    domain: {
      chainId: 1,
      name: "Ether Mail",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    },

    // Defining the message signing data content.
    message: {
      contents: "Hello, Bob!",
    },
    primaryType: "Mail",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Mail: [{ name: "contents", type: "string" }],
    },
  });

  const params = [address, msgParams];
  const method = "eth_signTypedData_v4";

  return await window.ethereum.request<unknown>({
    method,
    params,
  });
};
