import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Loader } from "../Loader";
import { GAME_STATES } from "../../constants";
import GameMenuUI from "./UI/GameMenu";
import GamePlayUI from "./UI/GamePlay/GamePlay";
import GameEndUI from "./UI/GameEnd";
import GamePauseUI from "./UI/GamePause";
import GameSettingUI from "./UI/GameSetting";
import { useGame } from "../../hooks/useGame";
import { Toggle } from "../Toggle";
import { useGameContext } from "../../contexts/game-context";
import GameLobby from "./UI/GameLobby";
import { SocketHandler } from "./SocketHandler";
import Tutorial from "../Tutorial";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

const BackVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
`;

export const GameScene = () => {
    const firstRef = useRef(false);

    const {
        canEnterGame,
        loading,
        setLoading,
        currentGameState,
        showGrid,
        setCanEnterGame,
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
        if (currentGameState === GAME_STATES.GAME_MENU) {
            const videoInstance = videoRef.current as HTMLVideoElement;
            if (videoInstance.paused) videoInstance.play();
        }
    }, [currentGameState]);

    useEffect(() => {
        if (firstRef.current) return;
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
            document
                .getElementsByClassName("loader")[0]
                .classList.add("enterGame");

            setTimeout(() => {
                setCanEnterGame(false);
                setLoading(false);

                setGameState(GAME_STATES.TUTORIAL);
            }, 3000);
        }
    };

    return (
        <Wrapper>
            <SocketHandler startGameAction={startGame} />

            <div ref={canvasDivRef}></div>

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
            ) : currentGameState === GAME_STATES.END ? (
                <GameEndUI />
            ) : currentGameState === GAME_STATES.GAME_LOBBY ? (
                <GameLobby />
            ) : null}
        </Wrapper>
    );
};

export default GameScene;
