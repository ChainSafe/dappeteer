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
exports.confirmTransaction = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.confirmTransaction = (page, getSingedIn, version) => (options) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.bringToFront();
    if (!(yield getSingedIn())) {
        throw new Error("You haven't signed in yet");
    }
    yield page.waitForTimeout(500);
    yield page.reload();
    if (options) {
        const editSelector = '.transaction-detail-edit:nth-child(1) button';
        const edit = yield page.waitForSelector(editSelector);
        yield edit.click();
        const processEditSelector = '.edit-gas-display__dapp-acknowledgement-button';
        const processEdit = yield page.waitForSelector(processEditSelector);
        yield processEdit.click();
        if (options.gas) {
            const gasSelector = '.advanced-gas-controls > div:nth-child(2) > label > div.numeric-input > input';
            const gas = yield page.waitForSelector(gasSelector);
            yield page.evaluate((selector) => (document.querySelectorAll(selector)[0].value = ''), gasSelector);
            yield gas.type(options.gas.toString());
        }
        if (options.gasLimit) {
            const gasLimitSelector = '.advanced-gas-controls > div:nth-child(1) > label > div.numeric-input > input';
            const gasLimit = yield page.waitForSelector(gasLimitSelector);
            yield page.evaluate((selector) => (document.querySelectorAll(selector)[0].value = ''), gasLimitSelector);
            yield gasLimit.type(options.gasLimit.toString());
        }
        const saveSelector = '.btn-primary';
        const save = yield page.waitForSelector(saveSelector);
        yield save.click();
    }
    const confirmButton = yield page.waitForSelector('.btn-primary');
    console.log(confirmButton);
    yield confirmButton.click();
});
