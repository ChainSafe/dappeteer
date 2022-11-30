import { AbiItem } from "web3-utils";

export const ContractInfo = {
  abi: [
    {
      constant: true,
      inputs: [],
      name: "count",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x06661abd",
    },
    {
      constant: false,
      inputs: [],
      name: "increase",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as AbiItem[],
  evm: {
    bytecode: {
      linkReferences: {},
      object:
        "608060405234801561001057600080fd5b5060bd8061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610604f576000357c01000000000000000000000000000000000000000000000000000000009004806306661abd146054578063e8927fbc146070575b600080fd5b605a6078565b6040518082815260200191505060405180910390f35b6076607e565b005b60005481565b600080815480929190600101919050555056fea165627a7a72305820fc33f994f18ba4440c94570ea658ed551e4c9914f16ddfae05477a898ea71e410029",
      opcodes:
        "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0xBD DUP1 PUSH2 0x1F PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH1 0x4F JUMPI PUSH1 0x0 CALLDATALOAD PUSH29 0x100000000000000000000000000000000000000000000000000000000 SWAP1 DIV DUP1 PUSH4 0x6661ABD EQ PUSH1 0x54 JUMPI DUP1 PUSH4 0xE8927FBC EQ PUSH1 0x70 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x5A PUSH1 0x78 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x76 PUSH1 0x7E JUMP JUMPDEST STOP JUMPDEST PUSH1 0x0 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 DUP1 DUP2 SLOAD DUP1 SWAP3 SWAP2 SWAP1 PUSH1 0x1 ADD SWAP2 SWAP1 POP SSTORE POP JUMP INVALID LOG1 PUSH6 0x627A7A723058 KECCAK256 0xfc CALLER 0xf9 SWAP5 CALL DUP12 LOG4 DIFFICULTY 0xc SWAP5 JUMPI 0xe 0xa6 PC 0xed SSTORE 0x1e 0x4c SWAP10 EQ CALL PUSH14 0xDFAE05477A898EA71E4100290000 ",
      sourceMap: "33:109:0:-;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;33:109:0;;;;;;;",
    },
  },
  address: "0x0fC7E4bD0784Af9b444015557CDBdA05d9D4D46e",
  jsonInterface: [
    {
      constant: true,
      inputs: [],
      name: "count",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x06661abd",
    },
    {
      constant: false,
      inputs: [],
      name: "increase",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xe8927fbc",
    },
  ],
};
