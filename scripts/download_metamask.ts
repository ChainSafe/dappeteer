import downloader from "../src/setup/utils/metaMaskDownloader";
import {RECOMMENDED_METAMASK_VERSION} from "../src"

(async function() {
    await downloader(RECOMMENDED_METAMASK_VERSION, {
        flask: false,
      });
    await downloader(RECOMMENDED_METAMASK_VERSION, {
        flask: true,
      });
})()