import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./game";
import { Loader } from "../Loader";
import AssetsManager from "./AssetsManager";
import { Toggle } from "../Toggle";
import { GAME_STATES } from "../../constants";
import GameMenuUI from "./UI/GameMenu";
import GamePlayUI from "./UI/GamePlay";
import GameEndUI from "./UI/GameEnd";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const [loading, setLoading] = useState(true);
    const [currentGameState, setCurrentGameSate] = useState(0);

    const [showGrid, setShowGrid] = useState(false);

    const canvasDivRef = useRef(null);
    const gameRef = useRef(null) as any;

    const createGame = useCallback(async () => {
        const assetsManager = new AssetsManager();

        await assetsManager.loadModels();

        setLoading(false);
        if (gameRef.current) return;

        gameRef.current = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManager,
        });

        setCurrentGameSate(gameRef.current._stateManager.getCurrentState());
    }, []);

    useEffect(() => {
        createGame();

        return () => {
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
            console.log("game start>>>", state);
            gameRef.current._stateManager.setState(state);
            setCurrentGameSate(state);
        }
    };

    return (
        <Wrapper>
            {/* {loading && <Loader />} */}

            <div ref={canvasDivRef}></div>

            {currentGameState === GAME_STATES["GAME_MENU"] && (
                <GameMenuUI setGameState={setGameState} />
            )}

            {currentGameState === GAME_STATES["PLAYING"] && <GamePlayUI />}

            {currentGameState === GAME_STATES["END"] && (
                <GameEndUI setGameState={setGameState} />
            )}

            <div className="absolute top-4 right-4">
                <Toggle
                    title={"Show Grid"}
                    checked={showGrid}
                    onChange={onToggleGrid}
                />
            </div>
        </Wrapper>
    );
};

export default GameScene;
