import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect } from "react";
import styled from "styled-components";
import { GAME_STATES } from "../../../constants";

const GamePlay = styled.div`
    .top-bar {
        width: 100%;
        position: fixed;
        aspect-ratio: 1920 / 90;
        top: -100px;
        background-size: 100% auto;
        background-image: url("/assets/images/top-bar.png");
    }
    .bottom-bar {
        position: fixed;
        bottom: -400px;
        background-size: 100% auto;
        width: 100%;
        aspect-ratio: 1920 / 302;
        background-image: url(/assets/images/bottom-bar.png);
    }
`;

export const GamePlayUI = (setGameState: any) => {
    const playControlDown = gsap.timeline();

    useEffect(() => {
        playControlDown
            .add("start")
            .to(
                ".top-bar",
                {
                    top: "0px",
                    duration: 1,
                },
                "start"
            )
            .to(
                ".bottom-bar",
                {
                    bottom: "0px",
                    duration: 1,
                },
                "start"
            );
    }, []);

    return (
        <GamePlay className="gameplay">
            <div className="top-bar"></div>
            <div className="bottom-bar"></div>
        </GamePlay>
    );
};

export default GamePlay;
