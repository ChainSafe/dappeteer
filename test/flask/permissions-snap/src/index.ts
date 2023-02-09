import { OnRpcRequestHandler } from "@metamask/snap-types";

declare const snap: {
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
    case "notify_inApp":
      {
        await snap.request({
          method: "snap_notify",
          params: {
            type: "inApp",
            message: `Hello snap in App notification from ${origin}`,
          },
        });
      }
      break;
    default:
      throw new Error("Method not found.");
  }
};
