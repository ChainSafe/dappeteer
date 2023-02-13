import { OnRpcRequestHandler } from "@metamask/snap-types";

declare const snap: {
  request(param: {
    method: string;
    params: { type: "Confirmation" | "Alert" | "Prompt"; content: Object };
  }): Promise<unknown>;
  request(param: {
    method: string;
    params: {
      type?: string;
      message?: string;
    };
  }): Promise<unknown>;
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "confirm":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "Confirmation",
          content: {
            type: "panel",
            children: [
              { type: "heading", value: `Confirmation ${origin}` },
              { type: "text", value: "Text here" },
            ],
          },
        },
      });
    case "alert":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "Alert",
          content: {
            type: "panel",
            children: [
              { type: "heading", value: `Confirmation ${origin}` },
              { type: "text", value: "Text here" },
            ],
          },
        },
      });
    case "prompt":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "Prompt",
          content: {
            type: "panel",
            children: [
              { type: "heading", value: `Confirmation ${origin}` },
              { type: "text", value: "Text here" },
            ],
          },
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
