"use strict";
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
exports.DAPPETEER_DEFAULT_CONFIG = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const index_1 = require("../index");
exports.DAPPETEER_DEFAULT_CONFIG = { metamaskVersion: 'latest' };
function default_1(jestConfig = { dappeteer: exports.DAPPETEER_DEFAULT_CONFIG }) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield index_1.launch(puppeteer_1.default, jestConfig.dappeteer || exports.DAPPETEER_DEFAULT_CONFIG);
        try {
            yield index_1.setupMetamask(browser, jestConfig.metamask);
            global.browser = browser;
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            throw error;
        }
        process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
    });
}
exports.default = default_1;
