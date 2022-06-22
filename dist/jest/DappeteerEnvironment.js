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
const jest_environment_node_1 = __importDefault(require("jest-environment-node"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const index_1 = require("../index");
class DappeteerEnvironment extends jest_environment_node_1.default {
    constructor(config) {
        super(config);
    }
    setup() {
        const _super = Object.create(null, {
            setup: { get: () => super.setup }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.setup.call(this);
            // get the wsEndpoint
            const wsEndpoint = process.env.PUPPETEER_WS_ENDPOINT;
            if (!wsEndpoint) {
                throw new Error('wsEndpoint not found');
            }
            // connect to puppeteer
            const browser = yield puppeteer_1.default.connect({
                browserWSEndpoint: wsEndpoint,
            });
            this.global.browser = browser;
            this.global.metamask = yield index_1.getMetamaskWindow(browser);
            this.global.page = yield browser.newPage();
        });
    }
}
module.exports = DappeteerEnvironment;
