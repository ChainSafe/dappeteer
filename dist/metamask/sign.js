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
exports.sign = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.sign = (page, getSingedIn, version) => () => __awaiter(void 0, void 0, void 0, function* () {
    yield page.bringToFront();
    if (!(yield getSingedIn())) {
        throw new Error("You haven't signed in yet");
    }
    yield page.reload();
    const button = yield Promise.race([
        page.waitForSelector('.request-signature__footer__sign-button'),
        page.waitForSelector('.signature-request-footer button:last-child'),
    ]);
    yield button.click();
});
