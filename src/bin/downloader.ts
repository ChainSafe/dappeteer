import path from "path";
import { RECOMMENDED_METAMASK_VERSION } from "../constants";
import downloader, {
  defaultDirectory,
} from "../setup/utils/metaMaskDownloader";

console.log(`Running MetaMask extension downloader`, "\n");

let flask = false;
let version = RECOMMENDED_METAMASK_VERSION;
let destination = defaultDirectory;

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "--flask") flask = true;
  else if (arg === "--version" || arg === "-v") version = process.argv[++i];
  else if (arg === "--destination" || arg === "-d")
    destination = path.resolve(process.argv[++i]);
  else {
    console.error(`Unknown argument ${arg}`);
    process.exit();
  }
}

void (async function () {
  await downloader(version, {
    flask,
    location: destination,
  });
})();
