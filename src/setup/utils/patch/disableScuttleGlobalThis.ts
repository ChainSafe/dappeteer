import path from "path";
import { readFileSync, writeFileSync } from "fs";

export const disableScuttleGlobalThis = (metaMaskPath: string): void => {
  const runtimeLavaMoatPath = path.resolve(metaMaskPath, "runtime-lavamoat.js");

  const file = readFileSync(runtimeLavaMoatPath, "utf8");
  const patchedFile = file.replace(
    `"scuttleGlobalThis":true`,
    `"scuttleGlobalThis":false`
  );
  writeFileSync(runtimeLavaMoatPath, patchedFile);
};
