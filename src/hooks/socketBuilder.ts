import { Socket } from "socket.io-client";

type Callback = (socket: Socket, ...args: any[]) => void | Promise<void>;

type Event = "connect" | "disconnect" | (string & {});

const registeredSocketEvents: Record<string, Callback[]> = {};

function registerSocketEvent(event: Event, callback: Callback) {
    if (!registeredSocketEvents[event]) {
        registeredSocketEvents[event] = [];
    }

    registeredSocketEvents[event].push(callback);
}

async function handleSocketEvent(event: Event, socket: Socket, ...args: any[]) {
    const fns = registeredSocketEvents[event];

    if (fns && fns.length > 0) {
        for (const fn of fns) {
            try {
                await fn(socket, ...args);
            } catch (error) {
                console.error(
                    `Error while handling socket ${
                        socket.id
                    } event ${event}: ${JSON.stringify(args)}: ${error}`
                );
            }
        }
    }
}

const builder = {
    registerSocketEvent,
    handleSocketEvent,
};

export default builder;
