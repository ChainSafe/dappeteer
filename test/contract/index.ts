import * as fs from 'fs';
import * as path from 'path';

import * as solc from 'solc';

type ContractSources = Record<string, { content: string }>;

function buildSources(): ContractSources {
  const sources: ContractSources = {};
  const contractsLocation = path.join(__dirname, '.');
  const contractsFiles = fs.readdirSync(contractsLocation);

  contractsFiles.forEach((file) => {
    const contractFullPath = path.resolve(contractsLocation, file);
    if (contractFullPath.endsWith('.sol')) {
      sources[file] = {
        content: fs.readFileSync(contractFullPath, 'utf8'),
      };
    }
  });

  return sources;
}

const INPUT = {
  language: 'Solidity',
  sources: buildSources(),
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compileContracts(): any {
  return JSON.parse(solc.compile(JSON.stringify(INPUT))).contracts;
}
