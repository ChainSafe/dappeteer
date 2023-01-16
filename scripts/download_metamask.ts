import downloader, {defaultDirectory} from "../src/setup/utils/metaMaskDownloader";
import {RECOMMENDED_METAMASK_VERSION} from "../src"

(async function() {
    await downloader(RECOMMENDED_METAMASK_VERSION, {
        location: defaultDirectory,
        flask: false,
      });
    await downloader(RECOMMENDED_METAMASK_VERSION, {
        location: defaultDirectory,
        flask: true,
      });
})()