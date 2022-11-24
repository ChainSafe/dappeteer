// eslint-disable-next-line @typescript-eslint/no-require-imports
import pEvent = require("p-event");
import { expect } from "chai";
import * as dappeteer from "../../src";
import { DappeteerPage } from "../../src";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";
import { notificationEmitter } from "../../src/snap/notificationEmitter";
import { NotificationItem } from "../../src/snap/types";
import { clickOnElement, openProfileDropdown } from "../../src/helpers";

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

  it("should install base snap from local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.BASE_SNAP], {
      hasPermissions: false,
      hasKeyPermissions: false,
    });
  });

  it("should install permissions snap local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.PERMISSIONS_SNAP], {
      hasPermissions: true,
      hasKeyPermissions: false,
    });
  });

  it("should install keys snap from local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.KEYS_SNAP], {
      hasPermissions: true,
      hasKeyPermissions: true,
    });
  });

  describe("should test snap methods", function () {
    let testPage: DappeteerPage;
    let snapId: string;

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
      snapId = await metamask.snaps.installSnap(
        this.snapServers[Snaps.METHODS_SNAP],
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
        snapId,
        "confirm"
      );

      await metamask.snaps.acceptDialog();

      expect(await invokeAction).to.equal(true);
    });

    it("should invoke provided snap method and REJECT the dialog", async function (this: TestContext) {
      const invokeAction = metamask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );
      await metamask.snaps.rejectDialog();

      expect(await invokeAction).to.equal(false);
    });

    it("should invoke IN APP NOTIFICATIONS", async function (this: TestContext) {
      const permissionSnapId = await metamask.snaps.installSnap(
        this.snapServers[Snaps.PERMISSIONS_SNAP],
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
      );

      await metamask.page.bringToFront();
      await openProfileDropdown(metamask.page);
      await clickOnElement(metamask.page, "Notifications");

      const newPage = await metamask.page.browser().newPage();
      await newPage.goto(metamask.page.url());

      const waitForNotificationPromise =
        metamask.snaps.waitForNotification(newPage);
      await metamask.snaps.invokeSnap(testPage, snapId, "notify_inApp");
      await waitForNotificationPromise;

      const waitForNotificationPromise2 =
        metamask.snaps.waitForNotification(newPage);
      await metamask.snaps.invokeSnap(
        testPage,
        permissionSnapId,
        "notify_inApp"
      );
      await waitForNotificationPromise2;

      const notifications = await metamask.snaps.getAllNotifications();

      expect(notifications[0].message).to.equal(
        "Hello from permissions snap in App notification"
      );
      expect(notifications[1].message).to.equal(
        "Hello from methods snap in App notification"
      );
    });

    it("should invoke IN APP NOTIFICATIONS emitter way", async function (this: TestContext) {
      const permissionSnapId = await metamask.snaps.installSnap(
        this.snapServers[Snaps.PERMISSIONS_SNAP],
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
      );
      const { emitter, notifications } = await notificationEmitter(
        metamask.page
      );

      const notificationPromise = pEvent<any, NotificationItem>(
        emitter,
        "newNotification"
      );

      await metamask.snaps.invokeSnap(testPage, snapId, "notify_inApp");
      await metamask.snaps.invokeSnap(
        testPage,
        permissionSnapId,
        "notify_inApp"
      );
      await notificationPromise;

      expect(notifications[0].message).to.contain(
        "Hello from permissions snap in App notification"
      );
      expect(notifications[1].message).to.contain(
        "Hello from methods snap in App notification"
      );
    });
  });
});
