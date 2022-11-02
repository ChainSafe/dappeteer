import { expect } from "chai";
import * as dappeteer from "../../src";
import { DappeteerPage } from "../../src/page";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";
import { toUrl } from "../utils/utils";

function getSnapIdByName(testContext: TestContext, snapName: Snaps): string {
  return `local:${toUrl(testContext.snapServers[snapName].address())}`;
}

describe("snaps", function () {
  let metamask: dappeteer.Dappeteer;

  before(function (this: TestContext) {
    metamask = this.metamask;
  });

  beforeEach(function (this: TestContext) {
    //skip those tests for non flask metamask
    if (!this.browser.isMetaMaskFlask()) {
      this.skip();
    }
  });

  it("should install base snap from npm", async function (this: TestContext) {
    await metamask.snaps.installSnap(
      metamask.page,
      getSnapIdByName(this, Snaps.BASE_SNAP),
      {
        hasPermissions: false,
        hasKeyPermissions: false,
      }
    );
  });

  it("should install permissions snap from npm", async function (this: TestContext) {
    await metamask.snaps.installSnap(
      metamask.page,
      getSnapIdByName(this, Snaps.PERMISSIONS_SNAP),
      {
        hasPermissions: true,
        hasKeyPermissions: false,
      }
    );
  });

  it("should install keys snap from npm", async function (this: TestContext) {
    await metamask.snaps.installSnap(
      metamask.page,
      getSnapIdByName(this, Snaps.KEYS_SNAP),
      {
        hasPermissions: true,
        hasKeyPermissions: true,
      }
    );
  });

  describe("should test snap methods", function () {
    let testPage: DappeteerPage;

    beforeEach(function (this: TestContext) {
      //skip those tests for non flask metamask
      if (!this.browser.isMetaMaskFlask()) {
        this.skip();
      }
    });

    before(async function (this: TestContext) {
      if (!this.browser.isMetaMaskFlask()) {
        this.skip();
        return;
      }
      await metamask.snaps.installSnap(
        metamask.page,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
      );

      testPage = await metamask.page.browser().newPage();
      await testPage.goto("https://google.com");
      return testPage;
    });

    it("should invoke provided snap method and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "confirm"
      );

      await metamask.snaps.acceptDialog();

      expect(await invokeAction).to.equal(true);
    });

    it("should invoke provided snap method and REJECT the dialog", async function (this: TestContext) {
      const invokeAction = metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "confirm"
      );

      await metamask.snaps.rejectDialog();

      expect(await invokeAction).to.equal(false);
    });
  });
});
