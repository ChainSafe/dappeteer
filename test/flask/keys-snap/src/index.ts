import { OnRpcRequestHandler } from "@metamask/snaps-types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    default:
      throw new Error("Method not found.");
  }
};
