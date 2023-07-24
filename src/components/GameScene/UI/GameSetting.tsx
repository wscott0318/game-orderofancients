import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { GAME_STATES } from "../../../constants";

const GameSetting = styled.div`
    z-index: 20;
    background-image: url("/assets/images/loading-back.png");
    background-size: 100% 100%;

    // backdrop-filter: saturate(0.5);
    // user-select: none;

    .menu {
        display: flex;
        flex-direction: column;
        background-image: url("/assets/images/menu-back.png");
        background-size: 100% 100%;
        align-items: center;
    }
    .button-col {
        position: relative;
        display: flex;
        flex-direction: column;

        gap: 3vw;
        margin-top: 10vw;
        // align-items: center;
    }
    .warButton {
        cursor: url("../assets/imgs/gameCursor.png");
        background-image: url("/assets/images/button-back-bright.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-size: cover;

        width: 16vw;
        height: 4.17vw;
        color: rgb(212, 212, 3);
        font-size: 2vw;
        font-weight: 900;
        // &:hover {
        //     background-image: url("/assets/images/button-hover.png");
        // }
    }
`;

const GameSettingUI = ({ setGameState }: any) => {
    const gameSettingRef = useRef<HTMLDivElement>(null);
    const menuDownAnim = gsap.timeline();

    // useEffect(() => {
    //     if (gameSettingRef.current) {
    //         const menu = gameSettingRef.current.childNodes[0];

    //         menuDownAnim.add("start").to(
    //             menu,
    //             {
    //                 top: "50vh",
    //                 duration: 1,
    //                 ease: CustomEase.create(
    //                     "custom",
    //                     "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
    //                 ),
    //             },
    //             "start"
    //         );
    //     }
    //     return () => {
    //         menuDownAnim.kill();
    //     };
    // }, []);

    // const gamePlay = () => {
    //     menuDownAnim.reverse();
    //     if (gameSettingRef.current) {
    //         gsap.to(gameSettingRef.current, {
    //             backgroundColor: "#00000000",
    //             duration: 1,
    //             delay: 1,
    //         });
    //     }
    //     gsap.delayedCall(2, () => {
    //         setGameState(GAME_STATES.PLAYING);
    //     });
    // };

    return (
        <GameSetting
            className="absolute top-0 left-0 w-full h-full bg-[#00000059] flex justify-center pointer"
            ref={gameSettingRef}
        >
            <div className="menu relative w-[28.7vw] h-[33vw] top-[-50vh] translate-y-[-50%]">
                <div className="button-col">
                    <button
                        className="warButton"
                        name="play"
                        onClick={() => {}}
                    >
                        PLAY
                    </button>
                    <button className="warButton" name="versus">
                        Setting
                    </button>
                    <button className="warButton" name="custom">
                        Provider
                    </button>
                </div>
            </div>
        </GameSetting>
    );
};

export default GameSettingUI;
