import * as path from "path";
import { readJsonSync, writeJsonSync } from "fs-extra";

const DEFAULT_KEY =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjamYPwVQXybbRpzu+eIfPAy6WGb0dLqIEemi9CKTshabZg03Nqe7kqaMEWkHMWAk5MFgIhApMV7axEoidyWAlx/Vp5F9lNczfF8Nb1FaujNZKNnhkq98y2O6/PKK5oeHZAc/qwx3JFRBPRGdSE/cEeQzNGXRycnZucR3VAVMt3NI7DoGevCj+CYbqTITdVr7SqmiG8wfeIvIBOPJXo5jrNhjZ5de31mRYG8utDDd5cZN9dAG2ijKDnTTrvUBT3DomiuzzRhWAtSldvpQ0EJ/5rNEIkoStC1o5jKu5E7LQWqe+92My7YoaRPdIOjHmStlw6HKzjBfIloKFjv+9QIKqQIDAQAB";

export const addKeyToMetaMaskManifest = (
  metaMaskPath: string,
  key: string = DEFAULT_KEY
): void => {
  const manifestPath = path.resolve(metaMaskPath, "manifest.json");

  const json = readJsonSync(manifestPath) as { [key: string]: string };
  json.key = key;
  writeJsonSync(manifestPath, json, { spaces: 2 });
};
