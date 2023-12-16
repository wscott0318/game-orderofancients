import { useEffect, useRef } from "react";
import { useSocket } from "../../hooks/useSocket";
import {
    BotStatus,
    NewSpriteInfo,
    NewTextSpriteInfo,
    SpriteStatus,
    TimerStatus,
    TowerStatus,
} from "../../constants/type";
import { useGame } from "../../hooks/useGame";
import { SOCKET_EVENTS } from "../../constants/socket";
import {
    LobbyInfo,
    PlayerInfo,
    useGameContext,
} from "../../contexts/game-context";
import { GAME_STATES } from "../../constants";

interface SocketHandlerProps {
    startGameAction: () => void;
}

export const SocketHandler = ({ startGameAction }: SocketHandlerProps) => {
    const { socket } = useSocket();
    const { setGameState } = useGame();
    const { lobbyInfo, setLobbyInfo, setUpgrades } = useGameContext();

    const lobbyInfoRef = useRef<LobbyInfo>();
    lobbyInfoRef.current = lobbyInfo;

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
        const playerIndex = lobbyInfoRef.current?.players.findIndex(
            (player) => player.socketId === socket?.id
        );

        towerStatusdata.forEach((towerStatus, index) => {
            const towerManager = gameRef.current?._towerManagerArray[
                index
            ] as any;
            towerManager.level = towerStatus.level;
            towerManager.maxHp = towerStatus.maxHp;
            towerManager.hp = towerStatus.hp;
            towerManager.isDead = towerStatus.isDead;

            if (towerStatus.isDead && index === playerIndex) {
                setGameState(GAME_STATES.END);
            }

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
        if (
            gameRef.current?._botManagerArray[0].botArray.length !==
            botStatusData[0].length
        )
            console.error("unsynce bot data");

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

    const onAddSprite = (newSpriteInfo: NewSpriteInfo) => {
        gameRef.current?._spriteManager.addSpriteFrom(newSpriteInfo);
    };

    const onAddTextSprite = (newTextSpriteInfo: NewTextSpriteInfo) => {
        gameRef.current?._spriteManager.addTextSpriteFrom(newTextSpriteInfo);
    };

    const onAddSpriteCollisionEffect = (spriteIndex: number) => {
        gameRef.current?._spriteManager.spriteArray[
            spriteIndex
        ].addCollisionEffect();
    };

    const onDisposeSprite = (removeSpriteArray: number[]) => {
        const spriteArray = gameRef.current?._spriteManager.spriteArray;
        const newArray = [];

        for (let i = 0; i < spriteArray.length; i++) {
            const index = removeSpriteArray.findIndex(
                (removeIndex: number) => removeIndex === i
            );

            if (index === -1) newArray.push(spriteArray[i]);
            else spriteArray[i].dispose();
        }

        (gameRef.current?._spriteManager as any).spriteArray = newArray;
    };

    const onReceiveSpriteStatus = (spriteStatusData: SpriteStatus[]) => {
        const spriteArray = gameRef.current?._spriteManager.spriteArray;

        if (spriteArray.length !== spriteStatusData.length)
            console.error("sprite sync error");

        for (let i = 0; i < spriteStatusData.length; i++) {
            spriteArray[i].targetPos.x = spriteStatusData[i].targetPos.x;
            spriteArray[i].targetPos.y = spriteStatusData[i].targetPos.y;
            spriteArray[i].targetPos.z = spriteStatusData[i].targetPos.z;

            if (spriteArray[i].bounceCount)
                spriteArray[i].bounceCount = spriteStatusData[i].bounceCount;

            spriteArray[i].mesh.position.set(
                spriteStatusData[i].position.x,
                spriteStatusData[i].position.y,
                spriteStatusData[i].position.z
            );
        }
    };

    const onKillBot = (playerIndex: number, botIndex: number) => {
        gameRef.current?._botManagerArray[playerIndex].botArray[
            botIndex
        ].kill();
    };

    const onRemoveDeadBots = (playerIndex: number, deadBotArray: number[]) => {
        if (!gameRef.current?._botManagerArray[playerIndex].botArray) return;

        const newArray = [];
        const botArray =
            gameRef.current?._botManagerArray[playerIndex].botArray;
        for (let i = 0; i < botArray.length; i++) {
            const index = deadBotArray.findIndex(
                (deadIndex: number) => deadIndex === i
            );
            if (index === -1) newArray.push(botArray[i]);
        }

        (gameRef.current?._botManagerArray[playerIndex] as any).botArray =
            newArray;
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
            socket?.on(SOCKET_EVENTS.ADD_SPRITE, onAddSprite);
            socket?.on(SOCKET_EVENTS.ADD_TEXT_SPRITE, onAddTextSprite);
            socket?.on(
                SOCKET_EVENTS.ADD_SPRITE_COLLISION_EFFECT,
                onAddSpriteCollisionEffect
            );
            socket?.on(SOCKET_EVENTS.ADD_TEXT_SPRITE, onAddTextSprite);
            socket?.on(SOCKET_EVENTS.DISPOSE_SPRITE, onDisposeSprite);
            socket?.on(SOCKET_EVENTS.SPRITE_STATUS, onReceiveSpriteStatus);
            socket?.on(SOCKET_EVENTS.KILL_BOT, onKillBot);
            socket?.on(SOCKET_EVENTS.REMOVE_DEAD_BOTS, onRemoveDeadBots);

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
            socket?.off(
                SOCKET_EVENTS.ADD_SPRITE_COLLISION_EFFECT,
                onAddSpriteCollisionEffect
            );
            socket?.off(SOCKET_EVENTS.ADD_TEXT_SPRITE, onAddTextSprite);
            socket?.off(SOCKET_EVENTS.DISPOSE_SPRITE, onDisposeSprite);
            socket?.off(SOCKET_EVENTS.SPRITE_STATUS, onReceiveSpriteStatus);
            socket?.off(SOCKET_EVENTS.KILL_BOT, onKillBot);
        };
    }, [socket]);

    return <></>;
};
