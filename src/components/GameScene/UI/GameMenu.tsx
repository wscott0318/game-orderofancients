import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect } from "react";
import styled from "styled-components";

const GameMenu = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100vw;
    height: 100vh;
    background: #00000059;
    backdrop-filter: saturate(0.5);
    z-index: 20;

    .chain {
        position: absolute;
        width: 500px;
        height: 60px;
        background-image: url("/assets/images/chain.png");
        background-size: 100% 100%;
        top: -200px;
    }

    .menu {
        position: relative;
        width: 500px;
        height: 850px;
        top: -1000px;
        display: flex;
        flex-direction: column;
        background-image: url("/assets/images/menu.png");
        background-size: 100% 100%;
        align-items: center;
    }
    .button-col {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 7px;
        margin-top: 273px;
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
        cursor: url("/assets/images/cursor.png"), auto;
        &:hover {
            background-image: url("/assets/images/button-hover.png");
        }
    }
`;

export const GameMenuUI = () => {
    useEffect(() => {
        gsap.to(".menu", {
            top: "0px",
            duration: 1,
            ease: CustomEase.create(
                "custom",
                "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
            ),
        });
        gsap.to(".chain", {
            top: "-60px",
            duration: 1,
        });
        gsap.to(".chain", {
            height: "100px",
            duration: 0.1,
            delay: 0.78,
            yoyo: true,
            repeat: 1,
        });
    }, []);

    return (
        <GameMenu className="gameMenu">
            <div className="chain" />

            <div className="menu">
                <div className="button-col">
                    <button className="warButton" name="play">
                        PLAY
                    </button>
                    <button className="warButton" name="versus">
                        DIFFICULTY
                    </button>
                    <button className="warButton" name="custom">
                        SETTINGS
                    </button>
                    <button className="warButton" name="localarea">
                        TUTORIAL
                    </button>
                    <button className="warButton" name="setting">
                        PROVIDER
                    </button>
                    <button className="warButton" name="collection">
                        CONTACT US
                    </button>
                </div>
            </div>
        </GameMenu>
    );
};

export default GameMenuUI;
