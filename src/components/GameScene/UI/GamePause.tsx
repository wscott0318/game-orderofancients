import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect } from "react";
import styled from "styled-components";
import { GAME_STATES } from "../../../constants";

const GamePause = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    padding-left: 5%;
    width: 100vw;
    height: 100vh;
    background: #00000059;
    backdrop-filter: saturate(0.5);
    z-index: 20;
    justify-content: center;

    .chain {
        position: absolute;
        width: 500px;
        height: 110px;
        background-image: url("/assets/images/chain.png");
        background-size: 100% 100%;
        top: -300px;
    }
    .menu {
        position: relative;
        width: 500px;
        height: 486px;
        top: -1000px;
        display: flex;
        flex-direction: column;
        background-image: url("/assets/images/end.png");
        background-size: 100% 100%;
        align-items: center;
    }
    .button-col {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin-top: 270px;
        align-items: center;
    }
    .warButton {
        background-image: url("/assets/images/button-default.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-repeat: no-repeat;
        background-size: cover;
        width: 367px;
        height: 77px;
        color: rgb(212, 212, 3);
        font-size: 20px;
        font-weight: 900;
        &:hover {
            background-image: url("/assets/images/button-hover.png");
        }
    }
`;

export const GamePauseUI = ({ setGameState }: any) => {
    const menuDownAnim = gsap.timeline();

    useEffect(() => {
        menuDownAnim
            .add("start")
            .to(
                ".menu",
                {
                    top: "63px",
                    duration: 1,
                    ease: CustomEase.create(
                        "custom",
                        "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                    ),
                },
                "start"
            )
            .to(
                ".chain",
                {
                    top: "-43px",
                    duration: 1,
                    ease: CustomEase.create(
                        "custom",
                        "M0,0,C0.53,0.512,0.846,1.448,1,1"
                    ),
                },
                "start"
            );
        return () => {
            menuDownAnim.kill();
        };
    }, []);

    const resumeGame = () => {
        menuDownAnim.reverse();
        gsap.to(".gameMenu", {
            backgroundColor: "#00000000",
            duration: 1,
            delay: 1,
        });
        gsap.delayedCall(2, () => {
            setGameState(GAME_STATES.PLAYING);
        });
    };

    const restartGame = () => {
        menuDownAnim.reverse();
        gsap.to(".gameMenu", {
            backgroundColor: "#00000000",
            duration: 1,
            delay: 1,
        });
        gsap.delayedCall(2, () => {
            setGameState(GAME_STATES.GAME_MENU);
        });
    };

    return (
        <GamePause>
            <div className="chain" />

            <div className="menu">
                <div className="button-col">
                    <button
                        className="warButton"
                        name="play"
                        onClick={resumeGame}
                    >
                        RESUME
                    </button>
                    <button
                        className="warButton"
                        name="versus"
                        onClick={restartGame}
                    >
                        RESTART
                    </button>
                </div>
            </div>
        </GamePause>
    );
};

export default GamePauseUI;
