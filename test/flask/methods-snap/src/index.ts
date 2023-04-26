import { OnRpcRequestHandler } from "@metamask/snaps-types";
import { heading, panel, text } from "@metamask/snaps-ui";

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "confirm":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            heading(`Confirmation ${origin}`),
            text("Text here"),
          ]),
        },
      });
    case "alert":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading(`Confirmation ${origin}`),
            text("Text here"),
          ]),
        },
      });
    case "prompt":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "prompt",
          content: panel([
            heading(`Confirmation ${origin}`),
            text("Text here"),
          ]),
        },
      });
    case "notify_inApp":
      {
        await snap.request({
          method: "snap_notify",
          params: {
            type: "inApp",
            message: "Hello from methods snap in App notification",
          },
        });
      }
      break;
    default:
      throw new Error("Method not found.");
  }
};
