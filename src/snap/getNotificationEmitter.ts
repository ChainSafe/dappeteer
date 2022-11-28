import { DappeteerPage } from "../page";
import NotificationsEmitter from "./NotificationsEmitter";

export const getNotificationEmitter =
  (page: DappeteerPage) => async (): Promise<NotificationsEmitter> => {
    const emitter = new NotificationsEmitter(page);
    await emitter.setup();
    return emitter;
  };
