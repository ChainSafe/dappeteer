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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetamaskWindow = exports.setupMetamask = exports.launch = exports.RECOMMENDED_METAMASK_VERSION = exports.getMetamask = void 0;
const metamask_1 = require("./metamask");
Object.defineProperty(exports, "getMetamask", { enumerable: true, get: function () { return metamask_1.getMetamask; } });
const metamaskDownloader_1 = __importDefault(require("./metamaskDownloader"));
const utils_1 = require("./utils");
exports.RECOMMENDED_METAMASK_VERSION = 'v10.8.1';
/**
 * Launch Puppeteer chromium instance with MetaMask plugin installed
 * */
function launch(puppeteerLib, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options || !options.metamaskVersion)
            throw new Error(`Pleas provide "metamaskVersion" (use recommended "${exports.RECOMMENDED_METAMASK_VERSION}" or "latest" to always get latest release of MetaMask)`);
        const { args, metamaskVersion, metamaskLocation } = options, rest = __rest(options, ["args", "metamaskVersion", "metamaskLocation"]);
        /* eslint-disable no-console */
        console.log(); // new line
        if (metamaskVersion === 'latest')
            console.warn('\x1b[33m%s\x1b[0m', `It is not recommended to run metamask with "latest" version. Use it at your own risk or set to the recommended version "${exports.RECOMMENDED_METAMASK_VERSION}".`);
        else if (utils_1.isNewerVersion(exports.RECOMMENDED_METAMASK_VERSION, metamaskVersion))
            console.warn('\x1b[33m%s\x1b[0m', `Seems you are running newer version of MetaMask that recommended by dappeteer team.
      Use it at your own risk or set to the recommended version "${exports.RECOMMENDED_METAMASK_VERSION}".`);
        else if (utils_1.isNewerVersion(metamaskVersion, exports.RECOMMENDED_METAMASK_VERSION))
            console.warn('\x1b[33m%s\x1b[0m', `Seems you are running older version of MetaMask that recommended by dappeteer team.
      Use it at your own risk or set the recommended version "${exports.RECOMMENDED_METAMASK_VERSION}".`);
        else
            console.log(`Running tests on MetaMask version ${metamaskVersion}`);
        console.log(); // new line
        /* eslint-enable no-console */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const METAMASK_PATH = yield metamaskDownloader_1.default(metamaskVersion, metamaskLocation);
        return puppeteerLib.launch(Object.assign({ headless: false, args: [`--disable-extensions-except=${METAMASK_PATH}`, `--load-extension=${METAMASK_PATH}`, ...(args || [])] }, rest));
    });
}
exports.launch = launch;
/**
 * Setup MetaMask with base account
 * */
const defaultMetamaskOptions = {
    showTestNets: true,
};
function setupMetamask(browser, options = defaultMetamaskOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        // set default values of not provided values (but required)
        for (const key of Object.keys(defaultMetamaskOptions)) {
            if (options[key] === undefined)
                options[key] = defaultMetamaskOptions[key];
        }
        const page = yield closeHomeScreen(browser);
        yield confirmWelcomeScreen(page);
        yield importAccount(page, options.seed || 'already turtle birth enroll since owner keep patch skirt drift any dinner', options.password || 'password1234', options.hideSeed);
        yield closeNotificationPage(browser);
        yield showTestNets(page);
        return metamask_1.getMetamask(page);
    });
}
exports.setupMetamask = setupMetamask;
/**
 * Return MetaMask instance
 * */
function getMetamaskWindow(browser, version) {
    return __awaiter(this, void 0, void 0, function* () {
        const metamaskPage = yield new Promise((resolve) => {
            browser.pages().then((pages) => {
                for (const page of pages) {
                    if (page.url().includes('chrome-extension'))
                        resolve(page);
                }
            });
        });
        return metamask_1.getMetamask(metamaskPage, version);
    });
}
exports.getMetamaskWindow = getMetamaskWindow;
function closeHomeScreen(browser) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            browser.on('targetcreated', (target) => __awaiter(this, void 0, void 0, function* () {
                if (target.url().match('chrome-extension://[a-z]+/home.html')) {
                    try {
                        const page = yield target.page();
                        resolve(page);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            }));
        });
    });
}
function closeNotificationPage(browser) {
    return __awaiter(this, void 0, void 0, function* () {
        browser.on('targetcreated', (target) => __awaiter(this, void 0, void 0, function* () {
            if (target.url().match('chrome-extension://[a-z]+/notification.html')) {
                try {
                    const page = yield target.page();
                    yield page.close();
                }
                catch (_a) {
                    return;
                }
            }
        }));
    });
}
function showTestNets(metamaskPage) {
    return __awaiter(this, void 0, void 0, function* () {
        const networkSwitcher = yield metamaskPage.waitForSelector('.network-display');
        yield networkSwitcher.click();
        yield metamaskPage.waitForSelector('li.dropdown-menu-item');
        const showHideButton = yield metamaskPage.waitForSelector('.network-dropdown-content--link');
        yield showHideButton.click();
        const option = yield metamaskPage.waitForSelector('.settings-page__body > div:nth-child(7) > div:nth-child(2) > div > div > div:nth-child(1)');
        yield option.click();
        const header = yield metamaskPage.waitForSelector('.app-header__logo-container');
        yield header.click();
    });
}
function confirmWelcomeScreen(metamaskPage) {
    return __awaiter(this, void 0, void 0, function* () {
        const continueButton = yield metamaskPage.waitForSelector('.welcome-page button');
        yield continueButton.click();
    });
}
function importAccount(metamaskPage, seed, password, hideSeed) {
    return __awaiter(this, void 0, void 0, function* () {
        const importLink = yield metamaskPage.waitForSelector('.first-time-flow button');
        yield importLink.click();
        const metricsOptOut = yield metamaskPage.waitForSelector('.metametrics-opt-in button.btn-primary');
        yield metricsOptOut.click();
        if (hideSeed) {
            const seedPhraseInput = yield metamaskPage.waitForSelector('.first-time-flow__seedphrase input[type=password]');
            yield seedPhraseInput.click();
            yield seedPhraseInput.type(seed);
        }
        else {
            const showSeedPhraseInput = yield metamaskPage.waitForSelector('#ftf-chk1-label');
            yield showSeedPhraseInput.click();
            const seedPhraseInput = yield metamaskPage.waitForSelector('.first-time-flow textarea');
            yield seedPhraseInput.type(seed);
        }
        const passwordInput = yield metamaskPage.waitForSelector('#password');
        yield passwordInput.type(password);
        const passwordConfirmInput = yield metamaskPage.waitForSelector('#confirm-password');
        yield passwordConfirmInput.type(password);
        const acceptTerms = yield metamaskPage.waitForSelector('.first-time-flow__terms');
        yield acceptTerms.click();
        const restoreButton = yield metamaskPage.waitForSelector('.first-time-flow button');
        yield restoreButton.click();
        const doneButton = yield metamaskPage.waitForSelector('.end-of-flow button');
        yield doneButton.click();
        const popupButton = yield metamaskPage.waitForSelector('.popover-header__button');
        yield popupButton.click();
    });
}
