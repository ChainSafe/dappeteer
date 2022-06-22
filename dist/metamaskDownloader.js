"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const https_1 = require("https");
const path = __importStar(require("path"));
const node_stream_zip_1 = __importDefault(require("node-stream-zip"));
const defaultDirectory = path.resolve(__dirname, '..', 'metamask');
exports.default = (version, location) => __awaiter(void 0, void 0, void 0, function* () {
    const metamaskDirectory = typeof location === 'string' ? location : (location === null || location === void 0 ? void 0 : location.extract) || defaultDirectory;
    const downloadDirectory = typeof location === 'string' ? location : (location === null || location === void 0 ? void 0 : location.download) || path.resolve(defaultDirectory, 'download');
    if (version !== 'latest') {
        const extractDestination = path.resolve(metamaskDirectory, version.replace(/\./g, '_'));
        if (fs.existsSync(extractDestination))
            return extractDestination;
    }
    const { filename, downloadUrl, tag } = yield getMetamaskReleases(version);
    const extractDestination = path.resolve(metamaskDirectory, tag.replace(/\./g, '_'));
    if (!fs.existsSync(extractDestination)) {
        const downloadedFile = yield downloadMetamaskReleases(filename, downloadUrl, downloadDirectory);
        const zip = new node_stream_zip_1.default.async({ file: downloadedFile });
        fs.mkdirSync(extractDestination);
        yield zip.extract(null, extractDestination);
    }
    return extractDestination;
});
// eslint-disable-next-line @typescript-eslint/naming-convention
const request = (url) => new Promise((resolve) => {
    const request = https_1.get(url, (response) => {
        if (response.statusCode == 302) {
            const redirectRequest = https_1.get(response.headers.location, resolve);
            redirectRequest.on('error', (error) => {
                // eslint-disable-next-line no-console
                console.warn('request redirected error:', error.message);
                throw error;
            });
        }
        else {
            resolve(response);
        }
    });
    request.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.warn('request error:', error.message);
        throw error;
    });
});
const downloadMetamaskReleases = (name, url, location) => 
// eslint-disable-next-line no-async-promise-executor
new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true });
    }
    const fileLocation = path.join(location, name);
    const file = fs.createWriteStream(fileLocation);
    const stream = yield request(url);
    stream.pipe(file);
    stream.on('end', () => {
        resolve(fileLocation);
    });
}));
const metamaskReleasesUrl = 'https://api.github.com/repos/metamask/metamask-extension/releases';
const getMetamaskReleases = (version) => new Promise((resolve, reject) => {
    let idx = 1;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const request = https_1.get(metamaskReleasesUrl + '?page=' + idx, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
        let body = '';
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = JSON.parse(body);
            if (data.message)
                return reject(data.message);
            for (const result of data) {
                if (result.draft)
                    continue;
                if (version === 'latest' || result.name.includes(version) || result.tag_name.includes(version)) {
                    for (const asset of result.assets) {
                        if (asset.name.includes('chrome'))
                            resolve({
                                downloadUrl: asset.browser_download_url,
                                filename: asset.name,
                                tag: result.tag_name,
                            });
                    }
                }
            }
            if (data.length === 0) {
                reject(`Version ${version} not found!`);
            }
            else {
                try {
                    idx++;
                    const { filename, downloadUrl, tag } = yield getMetamaskReleases(version);
                    resolve({
                        downloadUrl: downloadUrl,
                        filename: filename,
                        tag: tag,
                    });
                }
                catch (error) {
                    console.warn('getMetamaskReleases error:', error);
                    throw error;
                }
            }
        }));
    });
    request.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.warn('getMetamaskReleases error:', error.message);
        throw error;
    });
});
