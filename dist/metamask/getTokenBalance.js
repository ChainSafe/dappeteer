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
exports.getTokenBalance = void 0;
exports.getTokenBalance = (page) => (tokenSymbol) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.bringToFront();
    yield page.waitForTimeout(1000);
    const assetListItems = yield page.$$('.asset-list-item__token-button');
    for (let index = 0; index < assetListItems.length; index++) {
        const assetListItem = assetListItems[index];
        const titleAttributeValue = yield page.evaluate((item) => item.getAttribute('title'), assetListItem);
        if (titleAttributeValue.split(' ')[1].toUpperCase() === tokenSymbol.toUpperCase()) {
            const balance = titleAttributeValue.split(' ')[0];
            return parseFloat(balance);
        }
    }
    return 0;
});
