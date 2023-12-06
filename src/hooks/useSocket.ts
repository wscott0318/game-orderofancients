import { useEffect } from "react";
import io from "socket.io-client";
import { Config } from "../utils/config";
import { useGameContext } from "../contexts/game-context";
import { toast } from "react-toastify";

export const useSocket = () => {
    const { socket, setSocket } = useGameContext();

    useEffect(() => {
        try {
            if (!socket) {
                const socketInstance = io(Config.socketServerUrl);
                setSocket(socketInstance);

                socketInstance.on("connect_error", function (error) {
                    toast.error(
                        `Can't connect to server. Please check server status.`
                    );
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    return {
        socket,
    };
};
