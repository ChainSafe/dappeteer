import { expect } from "chai";
import { DappeteerPage, Dappeteer } from "../../src";
import { EXAMPLE_WEBSITE, TestContext } from "../constant";
import { Snaps } from "../deploy";

describe("snaps", function () {
  let metaMask: Dappeteer;
  let metaMaskPage: DappeteerPage;

  before(function (this: TestContext) {
    metaMask = this.metaMask;
    metaMaskPage = this.metaMaskPage;
  });

  beforeEach(function (this: TestContext) {
    //skip those tests for non flask metamask
    if (!this.browser.isMetaMaskFlask()) {
      this.skip();
    }
  });

  it("should install base snap from local server", async function (this: TestContext) {
    await metaMask.snaps.installSnap(this.snapServers[Snaps.BASE_SNAP], {
      hasPermissions: false,
      hasKeyPermissions: false,
    });
  });

  it("should install permissions snap local server", async function (this: TestContext) {
    await metaMask.snaps.installSnap(this.snapServers[Snaps.PERMISSIONS_SNAP], {
      hasPermissions: true,
      hasKeyPermissions: false,
    });
  });

  it("should install keys snap from local server", async function (this: TestContext) {
    await metaMask.snaps.installSnap(this.snapServers[Snaps.KEYS_SNAP], {
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
      }
      snapId = await metaMask.snaps.installSnap(
        this.snapServers[Snaps.METHODS_SNAP],
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
      );
      testPage = await metaMaskPage.browser().newPage();
      await testPage.goto(EXAMPLE_WEBSITE);
      return testPage;
    });

    it("should invoke provided snap method and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );

      await metaMask.snaps.acceptDialog();

      expect(await invokeAction).to.equal(true);
    });

    it("should invoke provided snap method and REJECT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );
      await metaMask.snaps.rejectDialog();

      expect(await invokeAction).to.equal(false);
    });

    it("should return all notifications", async function (this: TestContext) {
      const permissionSnapId = await metaMask.snaps.installSnap(
        this.snapServers[Snaps.PERMISSIONS_SNAP],
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
      );

      const emitter = await metaMask.snaps.getNotificationEmitter();
      const notificationPromise = emitter.waitForNotification();

      await metaMask.snaps.invokeSnap(testPage, snapId, "notify_inApp");
      await metaMask.snaps.invokeSnap(
        testPage,
        permissionSnapId,
        "notify_inApp"
      );
      await notificationPromise;

      const notifications = await metaMask.snaps.getAllNotifications();

      expect(notifications[0].message).to.contain(
        "Hello from permissions snap in App notification"
      );
      expect(notifications[1].message).to.contain(
        "Hello from methods snap in App notification"
      );
      await emitter.cleanup();
    });
  });
});
