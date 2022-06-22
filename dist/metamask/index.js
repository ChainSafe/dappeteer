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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetamask = void 0;
const addNetwork_1 = require("./addNetwork");
const addToken_1 = require("./addToken");
const approve_1 = require("./approve");
const confirmTransaction_1 = require("./confirmTransaction");
const getTokenBalance_1 = require("./getTokenBalance");
const importPk_1 = require("./importPk");
const lock_1 = require("./lock");
const sign_1 = require("./sign");
const switchAccount_1 = require("./switchAccount");
const switchNetwork_1 = require("./switchNetwork");
const unlock_1 = require("./unlock");
exports.getMetamask = (page, version) => __awaiter(void 0, void 0, void 0, function* () {
    // modified window object to kep state between tests
    const setSignedIn = (state) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.evaluate((s) => {
            window.signedIn = s;
        }, state);
    });
    const getSingedIn = () => page.evaluate(() => window.signedIn !== undefined
        ? window.signedIn
        : true);
    return {
        addNetwork: addNetwork_1.addNetwork(page, version),
        approve: approve_1.approve(page, version),
        confirmTransaction: confirmTransaction_1.confirmTransaction(page, getSingedIn, version),
        importPK: importPk_1.importPk(page, version),
        lock: lock_1.lock(page, setSignedIn, getSingedIn, version),
        sign: sign_1.sign(page, getSingedIn, version),
        switchAccount: switchAccount_1.switchAccount(page, version),
        switchNetwork: switchNetwork_1.switchNetwork(page, version),
        unlock: unlock_1.unlock(page, setSignedIn, getSingedIn, version),
        addToken: addToken_1.addToken(page),
        getTokenBalance: getTokenBalance_1.getTokenBalance(page),
        page,
    };
});
