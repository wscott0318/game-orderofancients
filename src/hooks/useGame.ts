import { useCallback, useEffect, useRef, useState } from "react";
import { generateUpgrades } from "../helper/game";
import { GAME_MODES, GAME_STATES } from "../constants";
import AssetsManager from "../components/GameScene/AssetsManager";
import { Game } from "../components/GameScene/game";
import { useGameContext } from "../contexts/game-context";

export const useGame = () => {
    const {
        assetsManager,
        setAssetsManager,
        setCanEnterGame,
        gameInstance,
        setGameInstance,
        setCurrentGameSate,
        setUpgrades,
        setGameMode,
        setShowGrid,
    } = useGameContext();

    /**
     * Canvas Game Ref
     */
    const canvasDivRef = useRef(null);

    const gameRef = useRef<Game | undefined>();
    gameRef.current = gameInstance;

    const createGame = useCallback(async () => {
        const assetsManagerRef = new AssetsManager();

        await assetsManagerRef.loadModels();

        setAssetsManager(assetsManagerRef);

        setCanEnterGame(true);
    }, []);

    const startGame = () => {
        if (gameRef.current) return;

        const game = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManager!,
            setCurrentGameSate: setCurrentGameSate,
            setUpgrades: setUpgrades,
        });

        setGameInstance(game);
        gameRef.current = game;

        setGameState(GAME_STATES.PLAYING);
    };

    const startMultiGame = () => {
        setGameMode(GAME_MODES.Lobby);
    };

    const setGameState = (state: number) => {
        console.error(gameRef.current);

        if (gameRef.current) {
            gameRef.current._stateManager.setState(state);
        }

        setCurrentGameSate(state);
    };

    const exitGameAction = () => {
        if (gameRef.current) gameRef.current.dispose();

        setGameInstance(undefined);

        setGameState(GAME_STATES.GAME_MENU);
    };

    const restartGameAction = () => {
        if (gameRef.current) gameRef.current.dispose();

        setGameInstance(undefined);

        startGame();
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
        startMultiGame,
        setGameState,
        onToggleGrid,
    };
};
