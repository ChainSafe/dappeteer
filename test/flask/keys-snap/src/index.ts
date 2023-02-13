import { OnRpcRequestHandler } from "@metamask/snap-types";

declare const snap: {
  request(param: {
    method: string;
    params: { type: "Confirmation"; content: Object };
  }): Promise<unknown>;
};

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case "hello":
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
    default:
      throw new Error("Method not found.");
  }
};
