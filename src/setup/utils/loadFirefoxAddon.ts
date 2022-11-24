import net from "net";
import { Buffer } from "buffer";

type AddonLoadResult = { success: boolean; metamaskURL: string };

export const loadFirefoxAddon = (
  port: number,
  host: string,
  addonPath: string
): Promise<AddonLoadResult> => {
  return new Promise<AddonLoadResult>((resolve) => {
    const socket = net.connect({
      port,
      host,
    });

    let success = false;
    let addonId: string;
    let metamaskURL: string;

    socket.once("error", console.error);
    socket.once("close", () => {
      resolve({ success, metamaskURL });
    });

    const send = (data: Record<string, string>): void => {
      const raw = Buffer.from(JSON.stringify(data));

      socket.write(`${raw.length}`);
      socket.write(":");
      socket.write(raw);
    };

    socket.on("connect", () => {
      send({
        to: "root",
        type: "getRoot",
      });
    });

    const onMessage = (message: any): void => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (message.addonsActor) {
        send({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
          to: message.addonsActor,
          type: "installTemporaryAddon",
          addonPath,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (message.addon) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        addonId = message.addon.id;
        success = true;
        send({
          to: "root",
          type: "listAddons",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (message.addons) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const addon = message.addons.find(({ id }) => id === addonId);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-plus-operands
        metamaskURL = addon.manifestURL.slice(0, -13);
        socket.end();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (message.error) {
        socket.end();
      }
    };

    const buffers: Buffer[] = [];
    let remainingBytes = 0;

    socket.on("data", (data) => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (remainingBytes === 0) {
          const index = data.indexOf(":");

          buffers.push(data);

          if (index === -1) {
            return;
          }

          const buffer = Buffer.concat(buffers);
          const bufferIndex = buffer.indexOf(":");

          buffers.length = 0;
          remainingBytes = Number(buffer.subarray(0, bufferIndex).toString());

          if (!Number.isFinite(remainingBytes)) {
            throw new Error("Invalid state");
          }

          data = buffer.subarray(bufferIndex + 1);
        }

        if (data.length < remainingBytes) {
          remainingBytes -= data.length;
          buffers.push(data);
          break;
        } else {
          buffers.push(data.subarray(0, remainingBytes));

          const buffer = Buffer.concat(buffers);
          buffers.length = 0;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const json = JSON.parse(buffer.toString());
          queueMicrotask(() => {
            onMessage(json);
          });

          const remainder = data.subarray(remainingBytes);
          remainingBytes = 0;

          if (remainder.length === 0) {
            break;
          } else {
            data = remainder;
          }
        }
      }
    });
  });
};
