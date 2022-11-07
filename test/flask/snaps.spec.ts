import { expect } from "chai";
import { Page } from "puppeteer";
import * as dappeteer from "../../src";
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
    if (this.browser.flask == null) {
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
    let testPage: Page;

    before(async function (this: TestContext) {
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

    it("should invoke IN APP NOTIFICATIONS and check for a text", async function (this: TestContext) {
      await metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "notify_inApp"
      );
      // Metamask doesn't allow to invoke two notifications in a row,
      // so some delay should persist before calling the next notification
      await metamask.page.waitForTimeout(5000);
      await metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "notify_inApp_update"
      );

      const notifications = await metamask.snaps.getAllNotifications();

      expect(notifications[0].message).to.equal("Update notification");
      expect(notifications[1].message).to.equal("Hello, in App notification");
    });
  });
});
