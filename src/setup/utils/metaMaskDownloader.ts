/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import * as fs from "fs";
import { IncomingMessage } from "http";
import { get } from "https";
import * as path from "path";

import StreamZip from "node-stream-zip";

export const defaultDirectory = path.resolve(
  "node_modules",
  ".cache",
  ".metamask"
);

export type Path =
  | string
  | {
      download: string;
      extract: string;
    };

export default async (
  version: string,
  options?: { location?: Path; flask?: boolean }
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

  console.log(
    `Getting MetaMask ${
      options.flask ? "flask" : ""
    } extension version: ${version}`
  );
  console.log(`extension stored in directory: ${metaMaskDirectory}`);
  console.log(`downloaded files stored in: ${downloadDirectory}`, "\n");

  if (version !== "latest") {
    let filename = version.replace(/\./g, "_");
    if (options?.flask) {
      filename = "flask_" + filename;
    }
    const extractDestination = path.resolve(metaMaskDirectory, filename);
    if (fs.existsSync(extractDestination)) {
      console.log(
        "Found already available extension files - skipping download"
      );
      return extractDestination;
    }
  }
  const { filename, downloadUrl, tag } = await getMetaMaskReleases(
    version,
    options?.flask ?? false
  );
  let destFilename = tag.replace(/\./g, "_");
  if (options?.flask) {
    destFilename = "flask_" + destFilename;
  }
  const extractDestination = path.resolve(metaMaskDirectory, destFilename);
  if (!fs.existsSync(extractDestination)) {
    const downloadedFile = await downloadMetaMaskReleases(
      filename,
      downloadUrl,
      downloadDirectory
    );
    console.log("Unpacking release");
    const zip = new StreamZip.async({ file: downloadedFile });
    fs.mkdirSync(extractDestination);
    await zip.extract(null, extractDestination);
    console.log("Unpack successful");
  } else {
    console.log("Found already available extension files - skipping download");
  }
  return extractDestination;
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
    console.log("Downloading MetaMask release");
    const fileLocation = path.join(location, name);
    const file = fs.createWriteStream(fileLocation);
    const stream = await request(url);
    stream.pipe(file);
    stream.on("end", () => {
      console.log("Download successful");
      resolve(fileLocation);
    });
  });

type MetaMaskReleases = { downloadUrl: string; filename: string; tag: string };
const metaMaskReleasesUrl =
  "https://api.github.com/repos/metamask/metamask-extension/releases";
const getMetaMaskReleases = (
  version: string,
  flask: boolean
): Promise<MetaMaskReleases> =>
  new Promise((resolve, reject) => {
    console.log("Searching for MetaMask release");
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
              result.tag_name.includes(version)
            ) {
              for (const asset of result.assets) {
                if (
                  (!flask && asset.name.includes("chrome")) ||
                  (flask &&
                    asset.name.includes("flask") &&
                    asset.name.includes("chrome"))
                ) {
                  console.log("Found requested MetaMask release");
                  resolve({
                    downloadUrl: asset.browser_download_url,
                    filename: asset.name,
                    tag: result.tag_name,
                  });
                }
              }
            }
          }
          reject(`Version ${version} (flask: ${String(flask)}) not found!`);
        });
      }
    );
    request.on("error", (error) => {
      console.warn("getMetaMaskReleases error:", error.message);
      throw error;
    });
  });
