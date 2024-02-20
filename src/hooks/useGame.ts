
import { useCallback, useRef } from "react";

import { GAME_MODES, GAME_STATES } from "../constants";
import { Game } from "../game";
import { LobbyInfo, useGameContext } from "../contexts/game-context";
import { Network } from "../game/networking/NetworkHandler";
import { Gfx } from "../game/gfx";
import { ResourcesManager } from "../game/managers/ResourcesManager";
import { EventBridge } from "../libs/EventBridge";

//

export const useGame = () => {

    const {
        setCanEnterGame,
        gameInstance,
        setGameInstance,
        setCurrentGameState,
        setUpgrades,
        setGameMode,
        setShowGrid,
        gameMode,
        lobbyInfo,
    } = useGameContext();

    const lobbyInfoRef = useRef<LobbyInfo>();
    lobbyInfoRef.current = lobbyInfo;

    /**
     * Canvas Game Ref
     */
    const canvasDivRef = useRef(null);

    const gameRef = useRef<Game | undefined>();
    gameRef.current = gameInstance;

    const createGame = useCallback(async () => {

        Network.initialize();

        ResourcesManager.load( ( progress ) => {

            EventBridge.dispatchToUI( 'LoadingProgressUpdate', progress );

        }, () => {

            console.log( 'Loading finished!' );
            setCanEnterGame( true );

        });

    }, []);

    const createGameInstance = () => {

        if (gameRef.current) return;

        let playerIndex: any = 0;
        playerIndex = lobbyInfoRef.current?.players.findIndex(
            (player) => player.socketId === Network.socket?.id
        );

        Gfx.init({ canvasDiv: canvasDivRef.current! });
        Gfx.update();

        const game = new Game({
            canvas: canvasDivRef.current!,
            setCurrentGameState: setCurrentGameState,
            setUpgrades: setUpgrades,
            gameMode: gameMode,
            lobbyInfo: lobbyInfoRef.current as any,
            playerIndex: playerIndex,
        });

        // tmp hack
        setTimeout(() => {

            game.animate();

        }, 1000 );

        setGameInstance(game);
        gameRef.current = game;

    };

    const startGame = () => {

        createGameInstance();
        setGameState(GAME_STATES.PLAYING);

    };

    const enterLooby = () => {

        setGameMode(GAME_MODES.Lobby);
        setGameState(GAME_STATES.GAME_LOBBY);

    };

    const setGameState = (state: number) => {

        if (gameRef.current) {
            gameRef.current._stateManager.setState(state);
        }

        setCurrentGameState(state);

    };

    const exitGameAction = () => {

        if (gameRef.current) gameRef.current.dispose();

        EventBridge.dispatchToGame( 'Dispose' );

        setGameInstance(undefined);
        setGameState(GAME_STATES.GAME_MENU);

    };

    const restartGameAction = () => {

        if (gameRef.current) gameRef.current.dispose();

        setGameInstance(undefined);
        setGameState(GAME_STATES.GAME_LOBBY);
        // startGame();

    };

    const onToggleGrid = (e: any) => {

        const isChecked = e.target.checked;
        setShowGrid(isChecked);

        EventBridge.dispatchToGame( 'toggleGrid', isChecked );

    };

    return {
        canvasDivRef,
        gameRef,
        createGame,
        exitGameAction,
        restartGameAction,
        startGame,
        enterLooby,
        setGameState,
        onToggleGrid
    };

};
