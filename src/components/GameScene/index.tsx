import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Game } from "./game";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const canvasDivRef = useRef(null);
    const gameRef = useRef(null) as any;

    useEffect(() => {
        if (gameRef.current) return;

        gameRef.current = new Game({
            canvas: canvasDivRef.current!,
        });

        return () => {
            // destry Game
        };
    }, []);

    return (
        <Wrapper>
            <div ref={canvasDivRef}></div>
        </Wrapper>
    );
};

export default GameScene;
