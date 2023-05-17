import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./game";
import { Loader } from "../Loader";
import AssetsManager from "./AssetsManager";
import { UI } from "./UI";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const [loading, setLoading] = useState(true);

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

    return (
        <Wrapper>
            {/* {loading ? <Loader /> : <UI />} */}
            {loading && <Loader />}
            <div ref={canvasDivRef}></div>
        </Wrapper>
    );
};

export default GameScene;
