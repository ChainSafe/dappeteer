import { OnRpcRequestHandler } from "@metamask/snaps-types";

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
