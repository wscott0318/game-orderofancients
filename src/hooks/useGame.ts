import { useCallback, useRef } from "react";

import { GAME_MODES, GAME_STATES } from "../constants";
import { AssetsManager } from "../game/managers/AssetsManager";
import { Game } from "../game/Game";
import { LobbyInfo, useGameContext } from "../contexts/game-context";
import { Network } from "../game/networking/NetworkHandler";
import { Gfx } from "../game/gfx";

//

export const useGame = () => {

    const {
        assetsManager,
        setAssetsManager,
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

    const assetsManagerRef = useRef<AssetsManager>();
    assetsManagerRef.current = assetsManager;

    /**
     * Canvas Game Ref
     */
    const canvasDivRef = useRef(null);

    const gameRef = useRef<Game | undefined>();
    gameRef.current = gameInstance;

    const createGame = useCallback(async () => {

        Network.initialize();

        const assetsManagerRef = new AssetsManager();
        await assetsManagerRef.loadModels();

        setAssetsManager(assetsManagerRef);
        setCanEnterGame(true);

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
            assetsManager: assetsManagerRef.current!,
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

        const game = gameRef.current!;
        if (isChecked) {
            game._sceneRenderer.addGrid();
        } else {
            game._sceneRenderer.removeGrid();
        }

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
