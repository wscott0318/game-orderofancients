import { ReactNode, createContext, useContext, useState } from "react";
import { GAME_MODES, GAME_STATES } from "../constants";
import { AssetsManager } from "../game/managers/AssetsManager";
import { Game } from "../game/Game";
import { spell } from "../constants/spell";

export interface PlayerInfo {
    socketId: string;
    upgrades: spell[];
}

export interface LobbyInfo {
    id: string;
    players: PlayerInfo[];
    status: number;
}

interface GameContextProps {
    canEnterGame: boolean;
    setCanEnterGame: (value: boolean) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    currentGameState: number;
    setCurrentGameState: (value: number) => void;
    upgrades: any[];
    setUpgrades: (value: any) => void;
    gameMode: number;
    setGameMode: (value: number) => void;
    showGrid: boolean;
    setShowGrid: (value: boolean) => void;
    gameInstance: Game | undefined;
    setGameInstance: (value: Game | undefined) => void;
    assetsManager: AssetsManager | undefined;
    setAssetsManager: (value: AssetsManager) => void;
    lobbyInfo: LobbyInfo | undefined;
    setLobbyInfo: (value: LobbyInfo) => void;
}

export const initialContext: GameContextProps = {
    canEnterGame: false,
    setCanEnterGame: () => {},
    loading: true,
    setLoading: () => {},
    currentGameState: GAME_STATES.NONE,
    setCurrentGameState: () => {},
    upgrades: [],
    setUpgrades: () => {},
    gameMode: GAME_MODES.Single,
    setGameMode: () => {},
    showGrid: false,
    setShowGrid: () => {},
    gameInstance: undefined,
    setGameInstance: () => {},
    assetsManager: undefined,
    setAssetsManager: () => {},
    lobbyInfo: undefined,
    setLobbyInfo: () => {},
};

export const GameContext = createContext<GameContextProps>(initialContext);

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
    const [canEnterGame, setCanEnterGame] = useState(
        initialContext.canEnterGame
    );
    const [loading, setLoading] = useState(initialContext.loading);

    const [currentGameState, setCurrentGameState] = useState(
        initialContext.currentGameState
    );
    const [upgrades, setUpgrades] = useState(initialContext.upgrades);
    const [gameMode, setGameMode] = useState(initialContext.gameMode);

    const [showGrid, setShowGrid] = useState(initialContext.showGrid);

    const [gameInstance, setGameInstance] = useState<Game>();
    const [assetsManager, setAssetsManager] = useState<AssetsManager>();

    const [lobbyInfo, setLobbyInfo] = useState<LobbyInfo>();

    return (
        <GameContext.Provider
            value={{
                canEnterGame,
                setCanEnterGame,
                loading,
                setLoading,
                currentGameState,
                setCurrentGameState,
                upgrades,
                setUpgrades,
                gameMode,
                setGameMode,
                showGrid,
                setShowGrid,
                gameInstance,
                setGameInstance,
                assetsManager,
                setAssetsManager,
                lobbyInfo,
                setLobbyInfo,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
