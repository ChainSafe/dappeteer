interface Params {
  address: string;
}

export const signLongTypedData = async ({
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
      attachedMoneyInEth: 4.2,
      from: {
        name: "Cow",
        wallets: [
          "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
        ],
      },
      to: [
        {
          name: "Bob",
          wallets: [
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
            "0xB0B0b0b0b0b0B000000000000000000000000000",
          ],
        },
      ],
    },
    // Refers to the keys of the *types* object below.
    primaryType: "Mail",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      // Not an EIP712Domain definition
      Group: [
        { name: "name", type: "string" },
        { name: "members", type: "Person[]" },
      ],
      // Refer to PrimaryType
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person[]" },
        { name: "contents", type: "string" },
      ],
      // Not an EIP712Domain definition
      Person: [
        { name: "name", type: "string" },
        { name: "wallets", type: "address[]" },
      ],
    },
  });

  const params = [address, msgParams];
  const method = "eth_signTypedData_v4";

  return await window.ethereum.request<unknown>({
    method,
    params,
  });
};
