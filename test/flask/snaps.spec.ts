import { expect } from "chai";
import { Page } from "puppeteer";
import * as dappeteer from "../../src";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";
import { toUrl } from "../utils/utils";
import { clickOnElement, openProfileDropdown } from "../../src/helpers";

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

    it("should invoke IN APP NOTIFICATION method and show text", async function (this: TestContext) {
      await metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "notify_inApp"
      );

      await metamask.page.bringToFront();
      await openProfileDropdown(metamask.page);
      await clickOnElement(metamask.page, "Notifications");

      const notificationItem = await metamask.page.waitForSelector(
        ".notifications__item"
      );
      const notificationText = await notificationItem.$eval(
        ".notifications__item__details__message",
        (el) => el.textContent
      );
      const unreadDot = await notificationItem.$eval(
        ".notifications__item__unread-dot",
        (el) => el.className
      );

      expect(notificationText).to.equal("Hello, in App notification");
      expect(unreadDot).to.equal("notifications__item__unread-dot unread");

      await notificationItem.click();
      const notificationItemUpdated = await metamask.page.waitForSelector(
        ".notifications__item"
      );

      expect(
        await notificationItemUpdated.$eval(
          ".notifications__item__unread-dot",
          (el) => el.className
        )
      ).to.equal("notifications__item__unread-dot");
    });
  });
});
