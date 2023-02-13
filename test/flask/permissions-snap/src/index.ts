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

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case "notify_inApp":
      {
        await snap.request({
          method: "snap_notify",
          params: {
            type: "inApp",
            message: "Hello from permissions snap in App notification",
          },
        });
      }
      break;
    default:
      throw new Error("Method not found.");
  }
};
