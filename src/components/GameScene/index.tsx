import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./game";
import { Loader } from "../Loader";
import AssetsManager from "./AssetsManager";
import { Toggle } from "../Toggle";
import { GAME_STATES } from "../../constants";
import GameMenuUI from "./UI/GameMenu";
import GamePlayUI from "./UI/GamePlay/GamePlay";
import GameEndUI from "./UI/GameEnd";
import GamePauseUI from "./UI/GamePause";

import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const firstRef = useRef(false);

    const canEnterGameRef = useRef() as any;

    const [loading, setLoading] = useState(true);
    const [canEnterGame, setCanEnterGame] = useState(false);
    const [currentGameState, setCurrentGameSate] = useState(0);

    canEnterGameRef.current = canEnterGame;

    const [showGrid, setShowGrid] = useState(false);

    const canvasDivRef = useRef(null);
    const gameRef = useRef(null) as any;
    const assetsManagerRef = useRef(null) as any;

    const createGame = useCallback(async () => {
        assetsManagerRef.current = new AssetsManager();

        await assetsManagerRef.current.loadModels();

        setCanEnterGame(true);
    }, []);

    const startGame = () => {
        if (gameRef.current) return;

        gameRef.current = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManagerRef.current,
            setCurrentGameSate: setCurrentGameSate,
        });

        setCurrentGameSate(gameRef.current._stateManager.getCurrentState());
    };

    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        // alert("change the oriented mode to landscape");
        // let portrait = window.matchMedia("(orientation: portrait)");
        // portrait.addEventListener("change", function (e) {
        //     if (e.matches) {
        //         console.log("portrait mode");
        //     } else {
        //         console.log("landscape mode");
        //     }
        // });
    }

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

    const setGameState = (state: number) => {
        if (gameRef.current) {
            gameRef.current._stateManager.setState(state);
        }
    };

    const onKeyDown = (e: any) => {
        if (canEnterGameRef.current) {
            document
                .getElementsByClassName("loader")[0]
                .classList.add("enterGame");

            setTimeout(() => {
                setCanEnterGame(false);
                setLoading(false);
                startGame();
            }, 3000);
        }

        if (e.key === "Pause") {
            if (currentGameState === GAME_STATES.PAUSE) {
                gameRef.current._stateManager.setState(GAME_STATES.PLAYING);
            } else if (currentGameState === GAME_STATES.PLAYING) {
                gameRef.current._stateManager.setState(GAME_STATES.PAUSE);
            }
        }
    };

    return (
        <Wrapper>
            {loading && <Loader canEnterGame={canEnterGame} />}

            <div ref={canvasDivRef}></div>

            {currentGameState === GAME_STATES["GAME_MENU"] ? (
                <GameMenuUI setGameState={setGameState} />
            ) : currentGameState === GAME_STATES["PLAYING"] ? (
                <>
                    <GamePlayUI gameRef={gameRef} />

                    <div className="absolute top-16 right-4">
                        <Toggle
                            title={"Show Grid"}
                            checked={showGrid}
                            onChange={onToggleGrid}
                        />
                    </div>
                </>
            ) : currentGameState === GAME_STATES["PAUSE"] ? (
                <GamePauseUI setGameState={setGameState} />
            ) : currentGameState === GAME_STATES["END"] ? (
                <GameEndUI setGameState={setGameState} />
            ) : null}
        </Wrapper>
    );
};

export default GameScene;
