import styled from "styled-components";
import GameScene from "../../components/GameScene";
import { GameProvider } from "../../contexts/game-context";
// import "../../theme/global.scss";

const Wrapper = styled.div`
    position: relative;
    background: #000;
`;

export const GamePage = () => {
    return (
        <GameProvider>
            <Wrapper className="w-full h-full">
                <GameScene />
            </Wrapper>
        </GameProvider>
    );
};

export default GamePage;
