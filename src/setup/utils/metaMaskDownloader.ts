/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import * as fs from "fs";
import { IncomingMessage } from "http";
import { get } from "https";
import * as path from "path";

import StreamZip from "node-stream-zip";

const defaultDirectory = path.resolve(__dirname, "..", "..", "..", ".metamask");

export type Path =
  | string
  | {
      download: string;
      extract: string;
    };

interface DownloaderOptions {
  location?: Path;
  flask?: boolean;
  releasesOptions?: { fromPage: number; maxPages: number };
}

export default async (
  version: string,
  browser: "chrome" | "firefox",
  options?: DownloaderOptions
): Promise<string> => {
  const location = options.location;
  const metaMaskDirectory =
    typeof location === "string"
      ? location
      : location?.extract || defaultDirectory;
  const downloadDirectory =
    typeof location === "string"
      ? location
      : location?.download || path.resolve(defaultDirectory, "download");

  if (version !== "latest") {
    const extractDestination = path.resolve(
      metaMaskDirectory,
      getFolderName(version, browser, options?.flask)
    );
    if (fs.existsSync(extractDestination)) return extractDestination;
  }
  const { filename, downloadUrl, tag } = await getMetaMaskReleases(
    version,
    browser,
    options?.flask
  );
  const extractDestination = path.resolve(
    metaMaskDirectory,
    getFolderName(tag, browser, options?.flask)
  );
  if (!fs.existsSync(extractDestination)) {
    const downloadedFile = await downloadMetaMaskReleases(
      filename,
      downloadUrl,
      downloadDirectory
    );
    const zip = new StreamZip.async({ file: downloadedFile });
    fs.mkdirSync(extractDestination);
    await zip.extract(null, extractDestination);
  }
  return extractDestination;
};

const getFolderName = (
  version: string,
  browser: string,
  isFlask: boolean
): string => {
  let filename = version.replace(/\./g, "_") + "_" + browser;
  if (isFlask) {
    filename = "flask_" + filename;
  }
  return filename;
};

const request = (url: string): Promise<IncomingMessage> =>
  new Promise((resolve) => {
    const request = get(url, (response) => {
      if (response.statusCode == 302) {
        const redirectRequest = get(response.headers.location, resolve);
        redirectRequest.on("error", (error) => {
          console.warn("request redirected error:", error.message);
          throw error;
        });
      } else {
        resolve(response);
      }
    });
    request.on("error", (error) => {
      console.warn("request error:", error.message);
      throw error;
    });
  });

const downloadMetaMaskReleases = (
  name: string,
  url: string,
  location: string
): Promise<string> =>
  // eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
  new Promise(async (resolve) => {
    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, { recursive: true });
    }
    const fileLocation = path.join(location, name);
    const file = fs.createWriteStream(fileLocation);
    const stream = await request(url);
    stream.pipe(file);
    stream.on("end", () => {
      resolve(fileLocation);
    });
  });

type MetaMaskReleases = { downloadUrl: string; filename: string; tag: string };
const getMetaMaskReleases = (
  version: string,
  browser: string,
  flask: boolean,
  options = { fromPage: 1, maxPages: 1 }
): Promise<MetaMaskReleases> =>
  // eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
  new Promise(async (resolve, reject) => {
    for (let page = options.fromPage; page <= options.maxPages; page++) {
      const data = JSON.parse(await getMetaMaskReleasesData(page));
      if (data.message) return reject(data.message);
      for (const result of data) {
        if (result.draft) continue;
        if (
          version === "latest" ||
          result.name.includes(version) ||
          result.tag_name.includes(version)
        ) {
          for (const asset of result.assets) {
            if (
              (!flask && asset.name.includes(browser)) ||
              (flask &&
                asset.name.includes("flask") &&
                asset.name.includes(browser))
            ) {
              resolve({
                downloadUrl: asset.browser_download_url,
                filename: asset.name,
                tag: result.tag_name,
              });
            }
          }
        }
      }
    }
    reject(`Version ${version} (flask: ${String(flask)}) not found!`);
  });

const getMetaMaskReleasesUrl = (page: number): string =>
  `https://api.github.com/repos/metamask/metamask-extension/releases?per_page=100&page=${page}`;
const getMetaMaskReleasesData = (page: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const request = get(
      getMetaMaskReleasesUrl(page),
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve(body);
        });
      }
    );
    request.on("error", (error) => {
      console.warn("getMetaMaskReleases error:", error.message);
      reject(error);
    });
  });
