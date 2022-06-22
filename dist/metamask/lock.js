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
exports.lock = void 0;
exports.lock = (page, setSignedIn, getSingedIn, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
version) => () => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield getSingedIn())) {
        throw new Error("You can't sign out because you haven't signed in yet");
    }
    yield page.bringToFront();
    const accountSwitcher = yield page.waitForSelector('.identicon');
    yield accountSwitcher.click();
    const lockButton = yield page.waitForSelector('.account-menu__lock-button');
    yield lockButton.click();
    yield setSignedIn(false);
});
