
import { useEffect, useRef, MouseEvent } from "react";
import styled from "styled-components";

import { Loader } from "../Loader";
import { GAME_STATES, ROUND_TIME } from "../../constants";
import GameMenuUI from "./GameMenu";
import GamePlayUI from "./GamePlay/GamePlay";
import GameEndUI from "./GameEnd";
import GamePauseUI from "./GamePause";
import GameSettingUI from "./GameSetting";
import { useGame } from "../../hooks/useGame";
import { Toggle } from "../Toggle";
import { useGameContext } from "../../contexts/game-context";
import GameLobby from "./GameLobby";
import Tutorial from "../Tutorial";
import { CONVERT_TIME } from "../../utils/helper";
import { GameMain } from "../../game/main/GameMain";
import { GameEvents } from "../../game/Events";

//

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;

    canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
    }
`;

const BackVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
`;

//

export const GameScene = () => {

    const firstRef = useRef(false);

    const {
        canEnterGame,
        loading,
        setLoading,
        currentGameState,
        showGrid,
        setCanEnterGame,
        setUpgrades
    } = useGameContext();

    const {
        createGame,
        startGame,
        enterLooby,
        canvasDivRef,
        setGameState,
        onToggleGrid,
    } = useGame();

    const canEnterGameRef = useRef(false);
    canEnterGameRef.current = canEnterGame;

    const canPlayVideo =
        loading ||
        currentGameState === GAME_STATES.TUTORIAL ||
        currentGameState === GAME_STATES.GAME_MENU ||
        currentGameState === GAME_STATES.GAME_LOBBY;

    const videoRef = useRef() as any;

    useEffect(() => {

        if ( currentGameState === GAME_STATES.GAME_MENU ) {

            const videoInstance = videoRef.current as HTMLVideoElement;
            if (videoInstance.paused) videoInstance.play();

        }

    }, [currentGameState]);

    useEffect(() => {

        if ( firstRef.current ) return;
        firstRef.current = true;

        createGame();

        /** KeyDown Eventhandler for `Press Any Key` */
        window.addEventListener("keydown", onKeyDown.bind(this));
        window.addEventListener("click", onKeyDown.bind(this));

        return () => {
            window.removeEventListener("keydown", onKeyDown.bind(this));
            window.removeEventListener("click", onKeyDown.bind(this));
        };

    }, []);

    const onKeyDown = (e: any) => {

        if (canEnterGameRef.current && currentGameState === GAME_STATES.NONE) {

            document.getElementsByClassName("loader")[0].classList.add("enterGame");

            setTimeout(() => {

                setCanEnterGame(false);
                setLoading(false);
                setGameState(GAME_STATES.TUTORIAL);

            }, 3000);

        }

    };

    // tmp start

    const onTimeUpdateHandler = ( params: { roundTracker: number, totalTimeTracker: number } ) => {

        const totalTimeDiv = document.getElementById("elapsedTime");
        if (totalTimeDiv) {
            totalTimeDiv.textContent = CONVERT_TIME(
                Math.floor( params.totalTimeTracker )
            );
        }

        const barDiv = document.getElementById("timeBar");
        if (barDiv) {
            barDiv.style.width = `${( params.roundTracker / ROUND_TIME ) * 100 }%`;
        }

        const divEl = document.getElementById("remainingRoundTime");
        if (divEl) {
            divEl.textContent = `${ Math.ceil( params.roundTracker ) }s`;
        }

    };

    const updateUpgrades = ( upgrades: any[] ) => {

        setUpgrades( upgrades );

    };

    useEffect( () => {

        GameMain.addListener( GameEvents.START_GAME, startGame );
        GameMain.addListener( GameEvents.UPDATE_TIME, onTimeUpdateHandler );
        GameMain.addListener( GameEvents.SET_PLAYER_UPGRADES, updateUpgrades );

        return () => {

            GameMain.removeListener( GameEvents.START_GAME, startGame );
            GameMain.removeListener( GameEvents.UPDATE_TIME, onTimeUpdateHandler );
            GameMain.removeListener( GameEvents.SET_PLAYER_UPGRADES, updateUpgrades );

        };

    }, [] );

    const mouseDownHandler = ( event: MouseEvent ) : void => {

        GameMain.dispatchEvent( 'mousedown', { key: event.button, x: event.clientX, y: event.clientY } );

    };

    const mouseUpHandler = ( event: MouseEvent ) : void => {

        GameMain.dispatchEvent( 'mouseup', { key: event.button, x: event.clientX, y: event.clientY } );

    };

    const mouseMoveHandler = ( event: MouseEvent ) : void => {

        GameMain.dispatchEvent( 'mousemove', { key: event.button, x: event.clientX, y: event.clientY } );

    };

    // tmp end

    return (
        <Wrapper>
            <div ref={canvasDivRef} onMouseDown={ mouseDownHandler } onMouseUp={ mouseUpHandler } onMouseMove={ mouseMoveHandler }></div>

            {canPlayVideo && (
                <BackVideo ref={videoRef} loop className="opacity-[0.8]">
                    <source
                        src="/assets/videos/backVideo.mp4"
                        type="video/mp4"
                    />
                </BackVideo>
            )}

            {loading && <Loader canEnterGame={canEnterGame} />}

            {currentGameState === GAME_STATES.TUTORIAL ? (
                <Tutorial />
            ) : currentGameState === GAME_STATES.GAME_MENU ? (
                <GameMenuUI
                    setGameState={setGameState}
                    startMultiAction={enterLooby}
                />
            ) : currentGameState === GAME_STATES.SETTING ? (
                <GameSettingUI />
            ) : currentGameState === GAME_STATES.PLAYING ? (
                <>
                    <GamePlayUI />

                    <div className="absolute top-2 right-16">
                        <Toggle
                            title={"Show Grid"}
                            checked={showGrid}
                            onChange={onToggleGrid}
                        />
                    </div>
                </>
            ) : currentGameState === GAME_STATES.PAUSE ? (
                <GamePauseUI />
            ) : currentGameState === GAME_STATES.WON || currentGameState === GAME_STATES.LOST ? (
                <GameEndUI />
            ) : currentGameState === GAME_STATES.GAME_LOBBY ? (
                <GameLobby />
            ) : null}
        </Wrapper>
    );
};

export default GameScene;
