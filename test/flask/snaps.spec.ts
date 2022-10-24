import * as dappeteer from "../../src";
import { installSnap } from "../../src/snap";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";
import { toUrl } from "../utils/utils";

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
    await installSnap(
      metamask.page,
      "local:" + toUrl(this.snapServers[Snaps.BASE_SNAP].address()),
      {
        hasPermissions: false,
        hasKeyPermissions: false,
      }
    );
  });

  it("should install permissions snap from npm", async function (this: TestContext) {
    await installSnap(
      metamask.page,
      "local:" + toUrl(this.snapServers[Snaps.PERMISSIONS_SNAP].address()),
      {
        hasPermissions: true,
        hasKeyPermissions: false,
      }
    );
  });

  it("should install keys snap from npm", async function (this: TestContext) {
    await installSnap(
      metamask.page,
      "local:" + toUrl(this.snapServers[Snaps.KEYS_SNAP].address()),
      {
        hasPermissions: true,
        hasKeyPermissions: true,
      }
    );
  });
});
