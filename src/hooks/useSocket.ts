import { useEffect } from "react";
import io from "socket.io-client";
import { Config } from "../utils/config";
import { useGameContext } from "../contexts/game-context";

export const useSocket = () => {
    const { socket, setSocket } = useGameContext();

    useEffect(() => {
        if (!socket) {
            const socketInstance = io(Config.socketServerUrl);
            setSocket(socketInstance);
        }
    }, []);

    return {
        socket,
    };
};
