import { OnRpcRequestHandler } from "@metamask/snap-types";

declare const snap: {
  request(param: {
    method: string;
    params: {
      textAreaContent?: string;
      description?: string;
      prompt?: string;
    }[];
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
    case "notify_inApp":
      {
        await snap.request({
          method: "snap_notify",
          params: {
            type: "inApp",
            message: `Hello from methods snap in App notification`,
          },
        });
      }
      break;
    default:
      throw new Error("Method not found.");
  }
};
