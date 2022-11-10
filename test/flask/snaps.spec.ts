import { EventEmitter } from "events";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import pEvent = require("p-event");
import { expect } from "chai";
import * as dappeteer from "../../src";
import { DappeteerPage } from "../../src";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";

describe("snaps", function () {
  let metamask: dappeteer.Dappeteer;

  before(function (this: TestContext) {
    metamask = this.metamask;
  });

  beforeEach(function (this: TestContext) {
    //skip those tests for non flask metamask
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (!this.browser.isMetaMaskFlask()) {
        this.skip();
      }
    });

    before(async function (this: TestContext) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

    it("should invoke IN APP NOTIFICATIONS and check for a text", async function (this: TestContext) {
      await metamask.snaps.invokeSnap(testPage, snapId, "notify_inApp");

      const notifications = await metamask.snaps.getAllNotifications();

      expect(notifications[0].message).to.equal("Hello, in App notification");
    });

    // const notificationList: NotificationList = await page.$$eval(
    //   ".notifications__item__details__message",
    //   (elements) =>
    //     elements.map((element) => ({ message: element.textContent }))
    // );

    xit("should emmit IN APP NOTIFICATIONS and check for a text", async function (this: TestContext) {
      // const emitter: EventEmitter = await metamask.snaps.notificationEmitter();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const newNotificationPromise = pEvent(emitter, "newNotification");

      // await metamask.snaps.invokeSnap(
      //   testPage,
      //   getSnapIdByName(this, Snaps.METHODS_SNAP),
      //   "notify_inApp"
      // );

      await metamask.page.bringToFront();
      await openProfileDropdown(metamask.page);
      await clickOnElement(metamask.page, "Notifications");

      await Promise.race([
        metamask.page.waitForFunction(() => {
          const curLength = document.querySelectorAll(
            ".notifications__item__details__message"
          ).length;

          return curLength !== 0;
        }),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      await metamask.page.waitForTimeout(5000);

      await metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "notify_inApp"
      );

      await metamask.page.waitForTimeout(5000);

      await metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "notify_inApp"
      );

      await metamask.page.reload();

      await Promise.race([
        metamask.page.waitForFunction(() => {
          const curLength = document.querySelectorAll(
            ".notifications__item__details__message"
          ).length;

          return curLength !== 0;
        }),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      const notificationList2: NotificationList = await metamask.page.$$eval(
        ".notifications__item__details__message",
        (elements) =>
          elements.map((element) => ({ message: element.textContent }))
      );

      console.log(notificationList2);

      await metamask.page.waitForTimeout(1000000);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const result = await newNotificationPromise;
      //
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const notification = await newNotificationPromise;
      // console.log("notification length", result);
      // expect(notifications[0].message).to.equal("Hello, in App notification");
    });

    it("should emmit IN APP NOTIFICATIONS", async function (this: TestContext) {
      let notifications: NotificationList = [];
      const emitter: EventEmitter = await metamask.snaps.notificationEmitter();
      console.log(emitter);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      emitter.on("newNotification", async () => {
        notifications = await metamask.snaps.getAllNotifications();
      });

      const newNotificationPromise = pEvent(emitter, "newNotification");

      await metamask.snaps.invokeSnap(
        testPage,
        getSnapIdByName(this, Snaps.METHODS_SNAP),
        "notify_inApp"
      );

      // await Promise.race([
      //   metamask.page.waitForFunction(() => {
      //     const messages = document.querySelectorAll(
      //       ".notifications__item__details__message"
      //     );
      //
      //     emitter.emit("newNotification", messages);
      //
      //     return messages.length !== 0;
      //   }),
      //   new Promise((r) => setTimeout(r, 1000)),
      // ]);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await newNotificationPromise;

      console.log(notifications);
    });
  });
});
