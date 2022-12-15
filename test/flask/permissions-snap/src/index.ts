import { OnRpcRequestHandler } from "@metamask/snap-types";

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case "hello":
      return wallet.request({
        method: "snap_confirm",
        params: [
          {
            prompt: `Hello, ${origin}!`,
            description:
              "This custom confirmation is just for display purposes.",
            textAreaContent:
              "But you can edit the snap source code to make it do something, if you want to!",
          },
        ],
      });
    case "notify_inApp": {
      return wallet.request({
        method: "snap_notify",
        params: [
          {
            type: "inApp",
            message: `Hello from permissions snap in App notification`,
          },
        ],
      });
    }
    default:
      throw new Error("Method not found.");
  }
};
