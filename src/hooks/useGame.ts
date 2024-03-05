
import { useCallback, useRef } from "react";

import { GAME_MODES, GAME_STATES } from "../constants";
import { useGameContext } from "../contexts/game-context";
import { EventBridge } from "../libs/EventBridge";
import { GameMain } from "../game/main/GameMain";
import { GameEvents } from "../game/Events";

//

export const useGame = () => {

    const {
        setCanEnterGame,
        setCurrentGameState,
        setGameMode,
        setShowGrid,
        gameMode,
        lobbyInfo
    } = useGameContext();

    /**
     * Canvas Game Ref
     */
    const canvasDivRef = useRef(null);

    const createGame = useCallback(async () => {

        GameMain.dispatchEvent( GameEvents.INIT_NETWORK );
        GameMain.dispatchEvent( GameEvents.LOAD_ASSETS );

        GameMain.addListener( GameEvents.ASSETS_LOADING_PROGRESS_UPDATE, (progress: number) => {

            EventBridge.dispatchToUI( 'LoadingProgressUpdate', progress );

        });

        GameMain.addListener( GameEvents.ASSETS_LOADING_FINISHED, () => {

            setCanEnterGame( true );

        });

    }, []);

    const createGameInstance = () => {

        GameMain.initGFX({
            canvas:                 ( canvasDivRef.current! as HTMLElement ).children[0] as HTMLCanvasElement,
            gameMode:               gameMode
        });

    };

    const startGame = () => {

        createGameInstance();
        setGameState( GAME_STATES.PLAYING );

    };

    const enterLooby = () => {

        setGameMode( GAME_MODES.Lobby );
        setGameState( GAME_STATES.GAME_LOBBY );

    };

    const setGameState = (state: number) => {

        GameMain.dispatchEvent( GameEvents.SET_STATE, state );

        setCurrentGameState( state );

    };

    const exitGameAction = () => {

        GameMain.dispose();
        setGameState( GAME_STATES.GAME_MENU );

    };

    const restartGameAction = () => {

        GameMain.dispose();
        setGameState( GAME_STATES.GAME_LOBBY );

        // todo
        // startGame();

    };

    const onToggleGrid = (e: any) => {

        const isChecked = e.target.checked;
        setShowGrid( isChecked );

        EventBridge.dispatchToGame( 'toggleGrid', isChecked );

    };

    return {
        canvasDivRef,
        createGame,
        exitGameAction,
        restartGameAction,
        startGame,
        enterLooby,
        setGameState,
        onToggleGrid
    };

};
