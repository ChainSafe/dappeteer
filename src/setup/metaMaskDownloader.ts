/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import * as fs from "fs";
import { IncomingMessage } from "http";
import { get } from "https";
import * as path from "path";

import StreamZip from "node-stream-zip";

const defaultDirectory = path.resolve(__dirname, "..", "..", "metamask");

export type Path =
  | string
  | {
      download: string;
      extract: string;
    };

export default async (version: string, location?: Path): Promise<string> => {
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
      version.replace(/\./g, "_")
    );
    if (fs.existsSync(extractDestination)) return extractDestination;
  }
  const { filename, downloadUrl, tag } = await getMetaMaskReleases(version);
  const extractDestination = path.resolve(
    metaMaskDirectory,
    tag.replace(/\./g, "_")
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

// eslint-disable-next-line @typescript-eslint/naming-convention
const request = (url: string): Promise<IncomingMessage> =>
  new Promise((resolve) => {
    const request = get(url, (response) => {
      if (response.statusCode == 302) {
        const redirectRequest = get(response.headers.location, resolve);
        redirectRequest.on("error", (error) => {
          // eslint-disable-next-line no-console
          console.warn("request redirected error:", error.message);
          throw error;
        });
      } else {
        resolve(response);
      }
    });
    request.on("error", (error) => {
      // eslint-disable-next-line no-console
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
const metaMaskReleasesUrl =
  "https://api.github.com/repos/metamask/metamask-extension/releases";
const getMetaMaskReleases = (version: string): Promise<MetaMaskReleases> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const request = get(
      metaMaskReleasesUrl,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          const data = JSON.parse(body);
          if (data.message) return reject(data.message);
          for (const result of data) {
            if (result.draft) continue;
            if (
              version === "latest" ||
              result.name.includes(version) ||
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              result.tag_name.includes(version)
            ) {
              for (const asset of result.assets) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (asset.name.includes("chrome"))
                  resolve({
                    downloadUrl: asset.browser_download_url,
                    filename: asset.name,
                    tag: result.tag_name,
                  });
              }
            }
          }
          reject(`Version ${version} not found!`);
        });
      }
    );
    request.on("error", (error) => {
      // eslint-disable-next-line no-console
      console.warn("getMetaMaskReleases error:", error.message);
      throw error;
    });
  });
