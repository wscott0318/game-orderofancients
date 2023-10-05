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
import { useSocket } from "../../hooks/useSocket";
import GameLobby from "./UI/GameLobby";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const firstRef = useRef(false);

    const { socket } = useSocket();

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
        startLobbyGame,
        enterLooby,
        canvasDivRef,
        setGameState,
        onToggleGrid,
        gameRef,
    } = useGame();

    const canEnterGameRef = useRef(false);
    canEnterGameRef.current = canEnterGame;

    useEffect(() => {
        if (firstRef.current) return;
        firstRef.current = true;

        createGame();

        /** KeyDown Eventhandler for `Press Any Key` */
        window.addEventListener("keydown", onKeyDown.bind(this));
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            // destroy Game
        };
    }, []);

    const onKeyDown = (e: any) => {
        if (canEnterGameRef.current) {
            document
                .getElementsByClassName("loader")[0]
                .classList.add("enterGame");

            setTimeout(() => {
                setCanEnterGame(false);
                setLoading(false);

                setGameState(GAME_STATES.GAME_MENU);
            }, 3000);
        }

        if (e.key === "Pause") {
            if (currentGameState === GAME_STATES.PAUSE) {
                gameRef.current!._stateManager.setState(GAME_STATES.PLAYING);
            } else if (currentGameState === GAME_STATES.PLAYING) {
                gameRef.current!._stateManager.setState(GAME_STATES.PAUSE);
            }
        }
    };

    return (
        <Wrapper>
            <div ref={canvasDivRef}></div>

            {loading && <Loader canEnterGame={canEnterGame} />}

            {currentGameState === GAME_STATES.GAME_MENU && (
                <GameMenuUI
                    setGameState={setGameState}
                    startGameAction={startGame}
                    startMultiAction={enterLooby}
                />
            )}

            {currentGameState === GAME_STATES.SETTING && <GameSettingUI />}

            {currentGameState === GAME_STATES.PLAYING && (
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
            )}

            {currentGameState === GAME_STATES.PAUSE && <GamePauseUI />}

            {currentGameState === GAME_STATES.END && <GameEndUI />}

            {currentGameState === GAME_STATES.GAME_LOBBY && (
                <GameLobby startLobbyGame={startLobbyGame} />
            )}
        </Wrapper>
    );
};

export default GameScene;
