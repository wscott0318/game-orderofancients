import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./game";
import { Loader } from "../Loader";
import AssetsManager from "./AssetsManager";
import { Toggle } from "../Toggle";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const [loading, setLoading] = useState(true);

    const [showGrid, setShowGrid] = useState(true);

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

    return (
        <Wrapper>
            {loading && <Loader />}

            <div ref={canvasDivRef}></div>

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
