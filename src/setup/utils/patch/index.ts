import { addKeyToMetaMaskManifest } from "./addKeyToMetaMaskManifest";
import { disableScuttleGlobalThis } from "./disableScuttleGlobalThis";

interface PatchOptions {
  key: string;
}

export const patchMetaMask = (
  metamaskPath: string,
  options: PatchOptions
): void => {
  addKeyToMetaMaskManifest(metamaskPath, options.key);
  disableScuttleGlobalThis(metamaskPath);
};
