import { useCallback, useRef, useState } from "react";
import { generateUpgrades } from "../helper/game";
import { GAME_MODES, GAME_STATES } from "../constants";
import AssetsManager from "../components/GameScene/AssetsManager";
import { Game } from "../components/GameScene/game";

export const useGame = () => {
    const canEnterGameRef = useRef() as any;
    const [canEnterGame, setCanEnterGame] = useState(false);
    canEnterGameRef.current = canEnterGame;

    const [loading, setLoading] = useState(true);
    const [currentGameState, setCurrentGameSate] = useState(GAME_STATES.NONE);
    const [upgrades, setUpgrades] = useState(generateUpgrades());
    const [gameMode, setGameMode] = useState(GAME_MODES.Single);

    const [showGrid, setShowGrid] = useState(false);

    /**
     * Canvas Game Ref
     */
    const canvasDivRef = useRef(null);
    const gameRef = useRef(null) as any;
    const assetsManagerRef = useRef<AssetsManager>();

    const createGame = useCallback(async () => {
        assetsManagerRef.current = new AssetsManager();

        await assetsManagerRef.current.loadModels();

        setCanEnterGame(true);
    }, []);

    const startGame = () => {
        if (gameRef.current) return;

        gameRef.current = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManagerRef.current!,
            setCurrentGameSate: setCurrentGameSate,
            setUpgrades: setUpgrades,
        });

        setGameState(GAME_STATES.PLAYING);
    };

    const startMultiGame = () => {
        setGameMode(GAME_MODES.Lobby);
    };

    const setGameState = (state: number) => {
        if (gameRef.current) {
            gameRef.current._stateManager.setState(state);
        }

        setCurrentGameSate(state);
    };

    const exitGameAction = () => {
        if (gameRef.current) (gameRef.current as Game).dispose();

        gameRef.current = null;

        setGameState(GAME_STATES.GAME_MENU);
    };

    const restartGameAction = () => {
        if (gameRef.current) (gameRef.current as Game).dispose();

        gameRef.current = null;

        startGame();
    };

    const onToggleGrid = (e: any) => {
        const isChecked = e.target.checked;
        setShowGrid(isChecked);

        const game = gameRef.current;
        if (isChecked) {
            game._sceneRenderer.addGrid();
        } else {
            game._sceneRenderer.removeGrid();
        }
    };

    return {
        canEnterGameRef,
        loading,
        currentGameState,
        upgrades,
        gameMode,
        canvasDivRef,
        gameRef,
        assetsManagerRef,
        createGame,
        exitGameAction,
        restartGameAction,
        startGame,
        startMultiGame,
        showGrid,

        setGameState,
        setUpgrades,
        setLoading,
        setCanEnterGame,
        onToggleGrid,
    };
};
