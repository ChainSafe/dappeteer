import fs from "fs";
import path from "path";
import os from "os";

export const getTemporaryUserDataDir = (): string =>
  fs.mkdtempSync(path.join(os.tmpdir(), `dappeteer-temporary-user-data-dir-`));
