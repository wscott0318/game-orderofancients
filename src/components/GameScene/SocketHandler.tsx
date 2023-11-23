import { useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { BotStatus, TimerStatus, TowerStatus } from "../../constants/type";
import { useGame } from "../../hooks/useGame";
import { SOCKET_EVENTS } from "../../constants/socket";
import {
    LobbyInfo,
    PlayerInfo,
    useGameContext,
} from "../../contexts/game-context";

interface SocketHandlerProps {
    startGameAction: () => void;
}

export const SocketHandler = ({ startGameAction }: SocketHandlerProps) => {
    const { socket } = useSocket();
    const { setLobbyInfo, setUpgrades } = useGameContext();

    const { gameRef } = useGame();

    const onStartGame = (lobby: LobbyInfo) => {
        setLobbyInfo(lobby);

        const player = lobby.players.find(
            (item) => item.socketId === socket?.id
        );
        setUpgrades(player?.upgrades);

        setTimeout(() => {
            startGameAction();
        }, 300);
    };

    const onReceiveLobbyData = (lobby: LobbyInfo) => {
        setLobbyInfo(lobby);
    };

    const onReceiveTowerStatus = (
        towerStatusdata: TowerStatus[],
        timerStatus: TimerStatus
    ) => {
        towerStatusdata.forEach((towerStatus, index) => {
            const towerManager = gameRef.current?._towerManagerArray[
                index
            ] as any;
            towerManager.level = towerStatus.level;
            towerManager.maxHp = towerStatus.maxHp;
            towerManager.hp = towerStatus.hp;
            towerManager.isDead = towerStatus.isDead;

            (gameRef.current?._playerStateArray[index] as any).gold =
                towerStatus.gold;
        });

        gameRef.current?._timeManagerArray.forEach((timeManager) => {
            timeManager.secondTracker = timerStatus.secondTracker;
            timeManager.roundTracker = timerStatus.roundTracker;
            timeManager.totalTimeTracker = timerStatus.totalTimeTracker;
        });
    };

    const onReceiveProduceBot = (playerIndex: number, newBot: any) => {
        gameRef.current?._botManagerArray[playerIndex].addNewBot(newBot);
    };

    const onReceiveBotStatus = (botStatusData: BotStatus[][]) => {
        for (let i = 0; i < botStatusData.length; i++) {
            for (let j = 0; j < botStatusData[i].length; j++) {
                const bot = gameRef.current?._botManagerArray[i].botArray[
                    j
                ] as any;
                bot.hp = botStatusData[i][j].hp;
                bot.position = botStatusData[i][j].position;
                bot.status = botStatusData[i][j].status;
                bot.oldStatus = botStatusData[i][j].oldStatus;
                bot.claimTime = botStatusData[i][j].claimTime;
                bot.canRemove = botStatusData[i][j].canRemove;
                bot.stunTime = botStatusData[i][j].stunTime;
                bot.slowTime = botStatusData[i][j].slowTime;
                bot.fireTime = botStatusData[i][j].fireTime;
            }
        }
    };

    const onReceiveUpgrades = (playersInfo: PlayerInfo[]) => {
        const player = playersInfo.find((el) => el.socketId === socket?.id);
        setUpgrades(player?.upgrades);
    };

    const onTickSecond = (playerIndex: number, value: number) => {
        gameRef.current?._timeManagerArray[playerIndex].tickSecond(value);
    };

    const onTickRound = (playerIndex: number) => {
        gameRef.current?._timeManagerArray[playerIndex].tickRound();
    };

    useEffect(() => {
        if (socket) {
            /** Start Game events */
            socket?.on(SOCKET_EVENTS.START_GAME, onStartGame);

            /** Game events */
            socket?.on(SOCKET_EVENTS.TOWER_STATUS, onReceiveTowerStatus);
            socket?.on(SOCKET_EVENTS.PRODUCE_BOT, onReceiveProduceBot);
            socket?.on(SOCKET_EVENTS.BOT_STATUS, onReceiveBotStatus);
            socket?.on(SOCKET_EVENTS.RECEIVE_UPGRADES, onReceiveUpgrades);
            socket?.on(SOCKET_EVENTS.TICK_SECOND, onTickSecond);
            socket?.on(SOCKET_EVENTS.TICK_ROUND, onTickRound);

            /** Looby events */
            socket?.on(SOCKET_EVENTS.LOBBY_DATA, onReceiveLobbyData);
        }

        return () => {
            socket?.off(SOCKET_EVENTS.START_GAME, onStartGame);
            socket?.off(SOCKET_EVENTS.TOWER_STATUS, onReceiveTowerStatus);
            socket?.off(SOCKET_EVENTS.PRODUCE_BOT, onReceiveProduceBot);
            socket?.off(SOCKET_EVENTS.BOT_STATUS, onReceiveBotStatus);
            socket?.off(SOCKET_EVENTS.RECEIVE_UPGRADES, onReceiveUpgrades);
            socket?.off(SOCKET_EVENTS.LOBBY_DATA, onReceiveLobbyData);
            socket?.off(SOCKET_EVENTS.TICK_SECOND, onTickSecond);
            socket?.off(SOCKET_EVENTS.TICK_ROUND, onTickRound);
        };
    }, [socket]);

    return <></>;
};
