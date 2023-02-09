import { DappeteerPage } from "../../page";
import { Dappeteer } from "../../types";
import { positiveDialog } from "./positiveDialog";
import { negativeDialog } from "./negativeDialog";
import { typeDialog } from "./typeDialog";

export const createDialogMethods = (
  page: DappeteerPage
): Dappeteer["snaps"]["dialog"] => ({
  positive: positiveDialog(page),
  negative: negativeDialog(page),
  type: typeDialog(page),
});
