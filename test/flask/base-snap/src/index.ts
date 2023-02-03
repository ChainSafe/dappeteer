import { OnRpcRequestHandler } from "@metamask/snap-types";

declare const snap: {
  request(param: {
    method: string;
    params: { textAreaContent: string; description: string; prompt: string }[];
  }): Promise<unknown>;
};

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case "hello":
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
    default:
      throw new Error("Method not found.");
  }
};
