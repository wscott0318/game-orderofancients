import styled from "styled-components";
import { Loader } from "../../components/Loader";
import GameScene from "../../components/GameScene";

const Wrapper = styled.div`
    position: relative;
    background: #000;
`;

export const Editor = () => {
    return (
        <Wrapper className="w-full h-full">
            <GameScene />
        </Wrapper>
    );
};

export default Editor;
