"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.__esModule = true;
var path = require("path");
var timeout = function (seconds) { return new Promise(function (resolve) { return setTimeout(resolve, seconds * 1000); }); };
function launch(puppeteer, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var args, rest, metamaskVersion, metamaskPath, METAMASK_VERSION, METAMASK_PATH;
        return __generator(this, function (_a) {
            args = options.args, rest = __rest(options, ["args"]);
            metamaskVersion = options.metamaskVersion, metamaskPath = options.metamaskPath;
            METAMASK_VERSION = metamaskVersion || '5.3.0';
            METAMASK_PATH = metamaskPath || path.resolve(__dirname, "metamask/" + METAMASK_VERSION);
            return [2 /*return*/, puppeteer.launch(__assign({ headless: false, args: [
                        "--disable-extensions-except=" + METAMASK_PATH,
                        "--load-extension=" + METAMASK_PATH
                    ].concat((args || [])) }, rest))];
        });
    });
}
exports.launch = launch;
function getMetamask(browser, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var metamaskPage, signedIn;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, closeHomeScreen(browser)
                    // const metamaskPage = await getMetamaskPage(browser, options.extensionId, options.extensionUrl)
                ];
                case 1:
                    metamaskPage = _a.sent();
                    // const metamaskPage = await getMetamaskPage(browser, options.extensionId, options.extensionUrl)
                    return [4 /*yield*/, confirmWelcomeScreen(metamaskPage)];
                case 2:
                    // const metamaskPage = await getMetamaskPage(browser, options.extensionId, options.extensionUrl)
                    _a.sent();
                    return [4 /*yield*/, importAccount(metamaskPage, options.seed || 'already turtle birth enroll since owner keep patch skirt drift any dinner', options.password || 'password1234')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, acceptTermsOfUse(metamaskPage)];
                case 4:
                    _a.sent();
                    signedIn = true;
                    closeNotificationPage(browser);
                    return [2 /*return*/, {
                            lock: function () { return __awaiter(_this, void 0, void 0, function () {
                                var accountSwitcher, signoutButton;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!signedIn) {
                                                throw new Error("You can't sign out because you haven't signed in yet");
                                            }
                                            return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('.identicon')];
                                        case 2:
                                            accountSwitcher = _a.sent();
                                            return [4 /*yield*/, accountSwitcher.click()];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('.account-menu__logout-button')];
                                        case 5:
                                            signoutButton = _a.sent();
                                            return [4 /*yield*/, signoutButton.click()];
                                        case 6:
                                            _a.sent();
                                            return [4 /*yield*/, waitForSignInScreen(metamaskPage)];
                                        case 7:
                                            _a.sent();
                                            signedIn = false;
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            unlock: function (password) {
                                if (password === void 0) { password = 'password1234'; }
                                return __awaiter(_this, void 0, void 0, function () {
                                    var passwordBox, login;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (signedIn) {
                                                    throw new Error("You can't sign in because you are already signed in");
                                                }
                                                return [4 /*yield*/, metamaskPage.bringToFront()];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, metamaskPage.$('#password')];
                                            case 2:
                                                passwordBox = _a.sent();
                                                return [4 /*yield*/, passwordBox.type(password)];
                                            case 3:
                                                _a.sent();
                                                return [4 /*yield*/, metamaskPage.$('.unlock-page button')];
                                            case 4:
                                                login = _a.sent();
                                                return [4 /*yield*/, login.click()];
                                            case 5:
                                                _a.sent();
                                                return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                            case 6:
                                                _a.sent();
                                                signedIn = true;
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                            addNetwork: function (url) { return __awaiter(_this, void 0, void 0, function () {
                                var networkSwitcher, networkIndex, networkButton, newRPCInput, saveButton, prevButton;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('.network-indicator')];
                                        case 2:
                                            networkSwitcher = _a.sent();
                                            return [4 /*yield*/, networkSwitcher.click()];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.evaluate(function (network) {
                                                    var elements = document.querySelectorAll('li.dropdown-menu-item');
                                                    for (var i = 0; i < elements.length; i++) {
                                                        var element = elements[i];
                                                        if (element.innerText.toLowerCase().includes(network.toLowerCase())) {
                                                            return i;
                                                        }
                                                    }
                                                    return elements.length - 1;
                                                }, 'Custom RPC')];
                                        case 5:
                                            networkIndex = _a.sent();
                                            return [4 /*yield*/, metamaskPage.$$('li.dropdown-menu-item')];
                                        case 6:
                                            networkButton = (_a.sent())[networkIndex];
                                            return [4 /*yield*/, networkButton.click()];
                                        case 7:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 8:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('input#new-rpc')];
                                        case 9:
                                            newRPCInput = _a.sent();
                                            return [4 /*yield*/, newRPCInput.type(url)];
                                        case 10:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('button.settings-tab__rpc-save-button')];
                                        case 11:
                                            saveButton = _a.sent();
                                            return [4 /*yield*/, saveButton.click()];
                                        case 12:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.5)];
                                        case 13:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('img.app-header__metafox-logo')];
                                        case 14:
                                            prevButton = _a.sent();
                                            return [4 /*yield*/, prevButton.click()];
                                        case 15:
                                            _a.sent();
                                            return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                        case 16:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            importPK: function (pk) { return __awaiter(_this, void 0, void 0, function () {
                                var accountSwitcher, addAccount, PKInput, importButton;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('.identicon')];
                                        case 2:
                                            accountSwitcher = _a.sent();
                                            return [4 /*yield*/, accountSwitcher.click()];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('.account-menu > div:nth-child(7)')];
                                        case 5:
                                            addAccount = _a.sent();
                                            return [4 /*yield*/, addAccount.click()];
                                        case 6:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 7:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('input#private-key-box')];
                                        case 8:
                                            PKInput = _a.sent();
                                            return [4 /*yield*/, PKInput.type(pk)];
                                        case 9:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('button.btn-primary')];
                                        case 10:
                                            importButton = _a.sent();
                                            return [4 /*yield*/, importButton.click()];
                                        case 11:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 12:
                                            _a.sent();
                                            return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                        case 13:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            switchAccount: function (accountNumber) { return __awaiter(_this, void 0, void 0, function () {
                                var accountSwitcher, account;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$('.identicon')];
                                        case 2:
                                            accountSwitcher = _a.sent();
                                            return [4 /*yield*/, accountSwitcher.click()];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(".account-menu__accounts > div:nth-child(" + accountNumber + ")")];
                                        case 5:
                                            account = _a.sent();
                                            return [4 /*yield*/, account.click()];
                                        case 6:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 7:
                                            _a.sent();
                                            return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                        case 8:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            switchNetwork: function (network) {
                                if (network === void 0) { network = 'main'; }
                                return __awaiter(_this, void 0, void 0, function () {
                                    var networkSwitcher, networkIndex, networkButton;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, metamaskPage.waitFor('.network-indicator')];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, metamaskPage.$('.network-indicator')];
                                            case 3:
                                                networkSwitcher = _a.sent();
                                                return [4 /*yield*/, networkSwitcher.click()];
                                            case 4:
                                                _a.sent();
                                                return [4 /*yield*/, timeout(0.1)];
                                            case 5:
                                                _a.sent();
                                                return [4 /*yield*/, metamaskPage.evaluate(function (network) {
                                                        var elements = document.querySelectorAll('li.dropdown-menu-item');
                                                        for (var i = 0; i < elements.length; i++) {
                                                            var element = elements[i];
                                                            if (element.innerText.toLowerCase().includes(network.toLowerCase())) {
                                                                return i;
                                                            }
                                                        }
                                                        return 0;
                                                    }, network)];
                                            case 6:
                                                networkIndex = _a.sent();
                                                return [4 /*yield*/, metamaskPage.$$('li.dropdown-menu-item')];
                                            case 7:
                                                networkButton = (_a.sent())[networkIndex];
                                                return [4 /*yield*/, networkButton.click()];
                                            case 8:
                                                _a.sent();
                                                return [4 /*yield*/, waitForEthereum(metamaskPage)];
                                            case 9:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                            confirmTransaction: function (options) { return __awaiter(_this, void 0, void 0, function () {
                                var editButtonSelector, editButton, tabSelector, tab, gasSelector, gas, gasLimitSelector, gasLimit, saveSelector, saveButton, confirmButtonSelector, confirmButton;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            if (!signedIn) {
                                                throw new Error("You haven't signed in yet");
                                            }
                                            return [4 /*yield*/, metamaskPage.reload()];
                                        case 2:
                                            _a.sent();
                                            if (!options) return [3 /*break*/, 26];
                                            editButtonSelector = 'div.confirm-detail-row__header-text--edit';
                                            return [4 /*yield*/, metamaskPage.waitFor(editButtonSelector)];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(editButtonSelector)];
                                        case 4:
                                            editButton = _a.sent();
                                            return [4 /*yield*/, editButton.click()];
                                        case 5:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 6:
                                            _a.sent();
                                            tabSelector = 'li.page-container__tab:nth-child(2)';
                                            return [4 /*yield*/, metamaskPage.waitFor(tabSelector)];
                                        case 7:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(tabSelector)];
                                        case 8:
                                            tab = _a.sent();
                                            return [4 /*yield*/, tab.click()];
                                        case 9:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 10:
                                            _a.sent();
                                            if (!options.gas) return [3 /*break*/, 15];
                                            gasSelector = 'div.advanced-tab__gas-edit-row:nth-child(1) input';
                                            return [4 /*yield*/, metamaskPage.waitFor(gasSelector)];
                                        case 11:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(gasSelector)];
                                        case 12:
                                            gas = _a.sent();
                                            return [4 /*yield*/, metamaskPage.evaluate(function () {
                                                    return (document.querySelectorAll('div.advanced-tab__gas-edit-row:nth-child(1) input')[0].value = '');
                                                })];
                                        case 13:
                                            _a.sent();
                                            return [4 /*yield*/, gas.type(options.gas.toString())];
                                        case 14:
                                            _a.sent();
                                            _a.label = 15;
                                        case 15:
                                            if (!options.gasLimit) return [3 /*break*/, 20];
                                            gasLimitSelector = 'div.advanced-tab__gas-edit-row:nth-child(2) input';
                                            return [4 /*yield*/, metamaskPage.waitFor(gasLimitSelector)];
                                        case 16:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(gasLimitSelector)];
                                        case 17:
                                            gasLimit = _a.sent();
                                            return [4 /*yield*/, metamaskPage.evaluate(function () {
                                                    return (document.querySelectorAll('div.advanced-tab__gas-edit-row:nth-child(2) input')[0].value = '');
                                                })];
                                        case 18:
                                            _a.sent();
                                            return [4 /*yield*/, gasLimit.type(options.gasLimit.toString())];
                                        case 19:
                                            _a.sent();
                                            _a.label = 20;
                                        case 20: return [4 /*yield*/, timeout(0.1)];
                                        case 21:
                                            _a.sent();
                                            saveSelector = '#app-content > div > span > div.modal > div > div > div > div.page-container__bottom > div.page-container__footer > header > button';
                                            return [4 /*yield*/, metamaskPage.waitFor(saveSelector)];
                                        case 22:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(saveSelector)];
                                        case 23:
                                            saveButton = _a.sent();
                                            return [4 /*yield*/, saveButton.click()];
                                        case 24:
                                            _a.sent();
                                            return [4 /*yield*/, timeout(0.1)];
                                        case 25:
                                            _a.sent();
                                            _a.label = 26;
                                        case 26:
                                            confirmButtonSelector = 'button.button.btn-confirm.btn--large.page-container__footer-button';
                                            return [4 /*yield*/, metamaskPage.waitFor(confirmButtonSelector)];
                                        case 27:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(confirmButtonSelector)];
                                        case 28:
                                            confirmButton = _a.sent();
                                            return [4 /*yield*/, confirmButton.click()];
                                        case 29:
                                            _a.sent();
                                            return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                        case 30:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            sign: function () { return __awaiter(_this, void 0, void 0, function () {
                                var confirmButtonSelector, button;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            if (!signedIn) {
                                                throw new Error("You haven't signed in yet");
                                            }
                                            return [4 /*yield*/, metamaskPage.reload()];
                                        case 2:
                                            _a.sent();
                                            confirmButtonSelector = '.request-signature__footer button.btn-primary';
                                            return [4 /*yield*/, metamaskPage.waitFor(confirmButtonSelector)];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(confirmButtonSelector)];
                                        case 4:
                                            button = _a.sent();
                                            return [4 /*yield*/, button.click()];
                                        case 5:
                                            _a.sent();
                                            return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                        case 6:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            approve: function () { return __awaiter(_this, void 0, void 0, function () {
                                var confirmButtonSelector, button;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, metamaskPage.bringToFront()];
                                        case 1:
                                            _a.sent();
                                            confirmButtonSelector = 'button.button.btn-confirm.btn--large.page-container__footer-button';
                                            return [4 /*yield*/, metamaskPage.waitFor(confirmButtonSelector)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, metamaskPage.$(confirmButtonSelector)];
                                        case 3:
                                            button = _a.sent();
                                            return [4 /*yield*/, button.click()];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, waitForUnlockedScreen(metamaskPage)];
                                        case 5:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        }];
            }
        });
    });
}
exports.getMetamask = getMetamask;
function closeHomeScreen(browser) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    browser.on('targetcreated', function (target) { return __awaiter(_this, void 0, void 0, function () {
                        var page, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html')) return [3 /*break*/, 4];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, target.page()];
                                case 2:
                                    page = _a.sent();
                                    resolve(page);
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    reject(e_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                })];
        });
    });
}
function closeNotificationPage(browser) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            browser.on('targetcreated', function (target) { return __awaiter(_this, void 0, void 0, function () {
                var page, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html')) return [3 /*break*/, 5];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, target.page()];
                        case 2:
                            page = _b.sent();
                            return [4 /*yield*/, page.close()];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function getMetamaskPage(browser, extensionId, extensionUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var EXTENSION_ID, EXTENSION_URL, metamaskPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    EXTENSION_ID = extensionId || 'nkbihfbeogaeaoehlefnkodbefgpgknn';
                    EXTENSION_URL = extensionUrl || "chrome-extension://" + EXTENSION_ID + "/popup.html";
                    return [4 /*yield*/, browser.newPage()];
                case 1:
                    metamaskPage = _a.sent();
                    return [4 /*yield*/, metamaskPage.goto(EXTENSION_URL)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function confirmWelcomeScreen(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        var continueButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitFor('.welcome-screen button')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('.welcome-screen button')];
                case 2:
                    continueButton = _a.sent();
                    return [4 /*yield*/, continueButton.click()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function importAccount(metamaskPage, seed, password) {
    return __awaiter(this, void 0, void 0, function () {
        var importLink, seedPhraseInput, passwordInput, passwordConfirmInput, restoreButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitFor('.first-time-flow a')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('.first-time-flow a')];
                case 2:
                    importLink = _a.sent();
                    return [4 /*yield*/, importLink.click()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.waitFor('.import-account textarea')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('.import-account textarea')];
                case 5:
                    seedPhraseInput = _a.sent();
                    return [4 /*yield*/, seedPhraseInput.type(seed)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.waitFor('#password')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('#password')];
                case 8:
                    passwordInput = _a.sent();
                    return [4 /*yield*/, passwordInput.type(password)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.waitFor('#confirm-password')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('#confirm-password')];
                case 11:
                    passwordConfirmInput = _a.sent();
                    return [4 /*yield*/, passwordConfirmInput.type(password)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.waitFor('.import-account button')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('.import-account button')];
                case 14:
                    restoreButton = _a.sent();
                    return [4 /*yield*/, restoreButton.click()];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function acceptTermsOfUse(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 3)) return [3 /*break*/, 4];
                    return [4 /*yield*/, waitForOneTermOfUse(metamaskPage)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function waitForOneTermOfUse(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        var termsOfUse, touButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitFor('.tou .tou__body')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('.tou .tou__body')];
                case 2:
                    termsOfUse = _a.sent();
                    return [4 /*yield*/, metamaskPage.evaluate(function (termsOfUse) {
                            termsOfUse.scrollTo(0, termsOfUse.scrollHeight);
                            return termsOfUse.scrollHeight;
                        }, termsOfUse)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.waitFor(function () { return document.querySelector('.tou button:disabled') == null; })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, metamaskPage.$('.tou button')];
                case 5:
                    touButton = _a.sent();
                    return [4 /*yield*/, touButton.click()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function waitForUnlockedScreen(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitForSelector('.main-container-wrapper')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function waitForSignInScreen(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitForSelector('#metamask-mascot-container')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function waitForEthereum(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.race([waitUntilStartConnectingToEthereum(metamaskPage), timeout(1)])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, Promise.race([waitUntilConnectedToEthereum(metamaskPage), timeout(10)])];
            }
        });
    });
}
function waitUntilStartConnectingToEthereum(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitFor(function () {
                        return !!document.querySelector('img[src="images/loading.svg"]');
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function waitUntilConnectedToEthereum(metamaskPage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, metamaskPage.waitFor(function () {
                        return document.querySelector('img[src="images/loading.svg"]') == null;
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
