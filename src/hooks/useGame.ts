import { useCallback, useRef } from "react";
import { GAME_MODES, GAME_STATES } from "../constants";
import AssetsManager from "../components/GameScene/AssetsManager";
import { Game } from "../components/GameScene/game";
import { LobbyInfo, useGameContext } from "../contexts/game-context";

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
        gameMode,
        lobbyInfo,
        socket,
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
        const assetsManagerRef = new AssetsManager();

        await assetsManagerRef.loadModels();

        setAssetsManager(assetsManagerRef);

        setCanEnterGame(true);
    }, []);

    const createGameInstance = () => {
        if (gameRef.current) return;

        let playerIndex: any = 0;

        if (gameMode === GAME_MODES.Lobby) {
            playerIndex = lobbyInfoRef.current?.players.findIndex(
                (player) => player.socketId === socket?.id
            );
        }

        const game = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManager!,
            setCurrentGameSate: setCurrentGameSate,
            setUpgrades: setUpgrades,
            gameMode: gameMode,
            lobbyInfo: lobbyInfoRef.current as any,
            playerIndex: playerIndex,
        });

        setGameInstance(game);
        gameRef.current = game;
    };

    const startGame = () => {
        createGameInstance();

        setGameMode(GAME_MODES.Single);
        setGameState(GAME_STATES.PLAYING);
    };

    const startLobbyGame = () => {
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
        startLobbyGame,
        enterLooby,
        setGameState,
        onToggleGrid,
    };
};
