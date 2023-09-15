import styled from "styled-components";
import GameScene from "../../components/GameScene";

const Wrapper = styled.div`
    position: relative;
    background: #000;
`;

export const GamePage = () => {
    return (
        <Wrapper className="w-full h-full">
            <GameScene />
        </Wrapper>
    );
};

export default GamePage;
