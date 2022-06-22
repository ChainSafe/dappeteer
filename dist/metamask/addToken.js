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
exports.addToken = void 0;
exports.addToken = (page) => (tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.bringToFront();
    const addTokenButton = yield page.waitForSelector('.box.import-token-link.box--flex-direction-row.box--text-align-center > a');
    yield addTokenButton.click();
    const addressInput = yield page.waitForSelector('#custom-address');
    yield addressInput.type(tokenAddress);
    yield page.waitForTimeout(4000);
    const nextButton = yield page.waitForSelector(`button[data-testid='page-container-footer-next']:not([disabled])`);
    yield nextButton.click();
    const footerButtons = yield page.$$('footer > button');
    yield footerButtons[1].click();
});
