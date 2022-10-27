import { expect } from "chai";
import { Page } from "puppeteer";
import * as dappeteer from "../../src";
import { installSnap, invokeSnap } from "../../src/snap";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";
import { toUrl } from "../utils/utils";

function getSnapIdByName(testContext: TestContext, snapName: Snaps): string {
  return `local:${toUrl(testContext.snapServers[snapName].address())}`;
}

describe("snaps", function () {
  let metamask: dappeteer.Dappeteer;

  async function installPermissionSnap(
    testContext: TestContext,
    snapAddress: string
  ): Promise<void> {
    await installSnap(
      metamask.page,
      getSnapIdByName(testContext, Snaps.PERMISSIONS_SNAP),
      {
        hasPermissions: true,
        hasKeyPermissions: false,
      },
      snapAddress
    );
  }

  async function getTestPage(snapAddress: string): Promise<Page> {
    const testPage = await metamask.page.browser().newPage();
    await testPage.goto(snapAddress);
    return testPage;
  }

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
    await installSnap(metamask.page, getSnapIdByName(this, Snaps.BASE_SNAP), {
      hasPermissions: false,
      hasKeyPermissions: false,
    });
  });

  it("should install permissions snap from npm", async function (this: TestContext) {
    await installPermissionSnap(this, "https://google.com");
  });

  it("should install keys snap from npm", async function (this: TestContext) {
    await installSnap(metamask.page, getSnapIdByName(this, Snaps.KEYS_SNAP), {
      hasPermissions: true,
      hasKeyPermissions: true,
    });
  });

  it("should invoke provided snap method and ACCEPT the dialog", async function (this: TestContext) {
    const snapAddress = "http://localhost:8545";
    await installPermissionSnap(this, snapAddress);
    const testPage = await getTestPage(snapAddress);
    const invokeAction = invokeSnap(
      testPage,
      getSnapIdByName(this, Snaps.PERMISSIONS_SNAP),
      "hello",
      { version: "latest" }
    );

    await metamask.page.bringToFront();
    await metamask.snaps.acceptDialog();

    expect(await invokeAction).to.equal(true);
  });

  it("should invoke provided snap method and REJECT the dialog", async function (this: TestContext) {
    const snapAddress = "http://localhost:8080";
    await installPermissionSnap(this, snapAddress);
    const testPage = await getTestPage(snapAddress);
    const invokeAction = invokeSnap(
      testPage,
      getSnapIdByName(this, Snaps.PERMISSIONS_SNAP),
      "hello",
      { version: "latest" }
    );

    await metamask.page.bringToFront();
    await metamask.snaps.rejectDialog();

    expect(await invokeAction).to.equal(false);
  });
});
