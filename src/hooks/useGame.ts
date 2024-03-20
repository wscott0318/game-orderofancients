
import { useCallback, useRef } from "react";

import { GAME_MODES, GAME_STATES } from "../constants";
import { useGameContext } from "../contexts/game-context";
import { GameMain } from "../game/main/GameMain";
import { GameEvents } from "../game/Events";
import { Config } from "../utils/config";

//

export const useGame = () => {

    const {
        setCanEnterGame,
        setCurrentGameState,
        setGameMode,
        setShowGrid,
        gameMode
    } = useGameContext();

    /**
     * Canvas Game Ref
     */

    const canvasDivRef = useRef(null);

    const createGame = useCallback( () => {

        GameMain.dispatchEvent( GameEvents.INIT_NETWORK, { config: Config } );
        GameMain.dispatchEvent( GameEvents.LOAD_ASSETS );

        GameMain.addListener( GameEvents.ASSETS_LOADING_FINISHED, () => {

            setCanEnterGame( true );

        });

        GameMain.addListener( GameEvents.SET_STATE, ( state ) => {

            setCurrentGameState( state );

        });

    }, []);

    const startGame = () => {

        GameMain.initGFX({
            container:      canvasDivRef.current! as HTMLDivElement,
            gameMode:       gameMode
        });

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

        GameMain.dispatchEvent( GameEvents.GFX_TOGGLE_GRID, isChecked );

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
