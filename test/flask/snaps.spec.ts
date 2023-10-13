import { expect } from "chai";
import { after } from "mocha";
import {
  Dappeteer,
  DappeteerBrowser,
  DappeteerPage,
  initSnapEnv,
} from "../../src";
import { EXAMPLE_WEBSITE, TestContext } from "../constant";
import { Snaps } from "../deploy";
import { isUserDataTest } from "../utils/utils";
import { goToHomePage } from "../../src/helpers";

describe("snaps", function () {
  let metaMask: Dappeteer;
  let metaMaskPage: DappeteerPage;

  before(function (this: TestContext) {
    if (isUserDataTest()) {
      this.skip();
    }

    metaMask = this.metaMask;
    metaMaskPage = this.metaMaskPage;
  });

  describe("Snaps Installation", () => {
    beforeEach(function (this: TestContext) {
      //skip those tests for non flask metamask
      if (!this.browser.isMetaMaskFlask()) {
        this.skip();
      }
    });

    it("should install base snap from local server", async function (this: TestContext) {
      await metaMask.snaps.installSnap(this.snapServers[Snaps.BASE_SNAP], {
        version: "1.0.0",
      });
    });

    it("should install permissions snap local server", async function (this: TestContext) {
      await metaMask.snaps.installSnap(
        this.snapServers[Snaps.PERMISSIONS_SNAP],
        { version: "1.0.0" }
      );
    });

    it("should install keys snap from local server", async function (this: TestContext) {
      await metaMask.snaps.installSnap(this.snapServers[Snaps.KEYS_SNAP], {
        version: "1.0.0",
      });
    });
  });

  describe("should test snap methods", function () {
    const installationSnapUrl = EXAMPLE_WEBSITE;
    let testPage: DappeteerPage;
    let snapId: string;
    let permissionSnapId: string;

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
        { installationSnapUrl, version: "1.0.0" }
      );
      permissionSnapId = await metaMask.snaps.installSnap(
        this.snapServers[Snaps.PERMISSIONS_SNAP],
        { installationSnapUrl, version: "1.0.0" }
      );

      testPage = await metaMaskPage.browser().newPage();
      await testPage.goto(installationSnapUrl);
      return testPage;
    });

    it("should return all notifications", async function (this: TestContext) {
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
      await goToHomePage(metaMask.page);
    });

    it("should invoke Confirmation snap_dialog method and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );

      await metaMask.snaps.dialog.accept();

      expect(await invokeAction).to.equal(true);
    });

    it("should invoke Confirmation snap_dialog method and REJECT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );
      await metaMask.snaps.dialog.reject();

      expect(await invokeAction).to.equal(false);
    });

    it("should invoke Alert snap_dialog method and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(testPage, snapId, "alert");
      await metaMask.snaps.dialog.accept();

      expect(await invokeAction).to.equal(null);
    });

    it("should invoke Prompt snap_dialog method type and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "prompt"
      );

      const message = "Some Message";

      await metaMask.snaps.dialog.type(message);
      await metaMask.snaps.dialog.accept();

      expect(await invokeAction).to.equal(message);
    });

    it("should invoke Prompt snap_dialog method not to type and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "prompt"
      );
      await metaMask.snaps.dialog.accept();

      expect(await invokeAction).to.equal("");
    });

    it("should invoke Prompt snap_dialog method and REJECT the dialog", async function (this: TestContext) {
      const invokeAction = metaMask.snaps.invokeSnap(
        testPage,
        snapId,
        "prompt"
      );
      await metaMask.snaps.dialog.reject();

      expect(await invokeAction).to.equal(null);
    });
  });
});

describe("should run dappeteer using initSnapEnv method", function () {
  let metaMask: Dappeteer;
  let browser: DappeteerBrowser;
  let connectedPage: DappeteerPage;
  let snapId: string;

  before(async function (this: TestContext) {
    if (isUserDataTest()) {
      this.skip();
    }
    if (!this.browser.isMetaMaskFlask()) {
      this.skip();
    }

    const installationSnapUrl = EXAMPLE_WEBSITE;
    ({ metaMask, snapId, browser } = await initSnapEnv({
      automation:
        (process.env.AUTOMATION as "puppeteer" | "playwright") ?? "puppeteer",
      snapIdOrLocation: this.snapServers[Snaps.BASE_SNAP],
      installationSnapUrl,
      version: "1.0.0",
    }));
    connectedPage = await metaMask.page.browser().newPage();
    await connectedPage.goto(installationSnapUrl);
  });

  after(async function (this: TestContext) {
    if (!isUserDataTest()) {
      if (this.browser.isMetaMaskFlask()) {
        await browser.close();
      }
    }
  });

  it("should accept dialog from Base snap", async function (this: TestContext) {
    const invokeAction = metaMask.snaps.invokeSnap(
      connectedPage,
      snapId,
      "hello"
    );

    await metaMask.snaps.dialog.accept();

    expect(await invokeAction).to.equal(true);
  });
});
