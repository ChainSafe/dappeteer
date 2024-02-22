/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import * as fs from 'fs';
import { IncomingMessage } from 'http';
import { get } from 'https';
import * as path from 'path';

import StreamZip from 'node-stream-zip';

export const defaultDirectory = path.resolve(
  'node_modules',
  '.cache',
  '.keplr'
);

export type Path =
  | string
  | {
      download: string;
      extract: string;
    };

export default async (): Promise<string> => {
  const keplrDirectory = defaultDirectory;
  const downloadDirectory = path.resolve(defaultDirectory, 'download');

  console.log(`extension stored in directory: ${keplrDirectory}`);
  console.log(`downloaded files stored in: ${downloadDirectory}`, '\n');

  const extractDestination = path.resolve(keplrDirectory);

  if (!fs.existsSync(extractDestination)) {
    let filename = 'keplr-extension-manifest-v2-v0.12.69.zip';
    let downloadUrl =
      'https://github.com/chainapsis/keplr-wallet/releases/download/v0.12.69/keplr-extension-manifest-v2-v0.12.69.zip';

    const downloadedFile = await downloadKeplrReleases(
      filename,
      downloadUrl,
      downloadDirectory
    );
    console.log('Unpacking release');
    const zip = new StreamZip.async({ file: downloadedFile });
    fs.mkdirSync(extractDestination);
    console.log("extractdestination", {extractDestination})
    await zip.extract(null, extractDestination);
    console.log('Unpack successful');
  } else {
    console.log('Found already available extension files - skipping download');
  }
  return extractDestination;
};

const request = (url: string): Promise<IncomingMessage> =>
  new Promise((resolve) => {
    const request = get(url, (response) => {
      if (response.statusCode == 302) {
        const redirectRequest = get(response.headers.location, resolve);
        redirectRequest.on('error', (error) => {
          console.warn('request redirected error:', error.message);
          throw error;
        });
      } else {
        resolve(response);
      }
    });
    request.on('error', (error) => {
      console.warn('request error:', error.message);
      throw error;
    });
  });

const downloadKeplrReleases = (
  name: string,
  url: string,
  location: string
): Promise<string> =>
  // eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
  new Promise(async (resolve) => {
    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, { recursive: true });
    }
    console.log('Downloading Keplr release');
    const fileLocation = path.join(location, name);
    const file = fs.createWriteStream(fileLocation);
    const stream = await request(url);
    stream.pipe(file);
    stream.on('end', () => {
      console.log('Download successful');
      resolve(fileLocation);
    });
  });
