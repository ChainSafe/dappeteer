import { DappeteerPage } from "../../page";
import { Dappeteer } from "../../types";
import { acceptDialog } from "./acceptDialog";
import { rejectDialog } from "./rejectDialog";
import { typeDialog } from "./typeDialog";

export const createDialogMethods = (
  page: DappeteerPage
): Dappeteer["snaps"]["dialog"] => ({
  accept: acceptDialog(page),
  reject: rejectDialog(page),
  type: typeDialog(page),
});
