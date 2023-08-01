import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { GAME_STATES } from "../../../constants";

const FadeIn = keyframes`
    from {
        filter: brightness(0);
    }

    to {
        filter: brightness(1);
    }
`;

const FadeOut = keyframes`
    from {
        filter: brightness(1);
    }

    to {
        filter: brightness(0);
    }
`;

const GameMenu = styled.div`
    z-index: 20;
    background-image: url("/assets/images/loading-back.png");
    background-size: 100% 100%;
    animation: 2s alternate ${FadeIn};

    &.inactive {
        animation: 2s alternate ${FadeOut};
    }

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
    }
    .warButton {
        cursor: url("../assets/imgs/gameCursor.png") !important;
        background-image: url("/assets/images/button-back-bright.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-size: cover;

        width: 16vw;
        height: 4.17vw;
        color: rgb(212, 212, 3);
        font-size: 2vw;
        font-weight: 900;
        user-select: none;

        &.menuPlay {
            background-image: url("/assets/images/menuBtns/play.png");
        }

        &.menuSetting {
            background-image: url("/assets/images/menuBtns/settings.png");
        }

        &.menuTraining {
            background-image: url("/assets/images/menuBtns/tranining.png");
        }
    }
`;

const GameMenuUI = ({ setGameState }: any) => {
    const gameMenuRef = useRef<HTMLDivElement>(null);
    const menuDownAnim = gsap.timeline();

    const [active, setActive] = useState(true);

    useEffect(() => {
        if (gameMenuRef.current) {
            const menu = gameMenuRef.current.childNodes[0];

            menuDownAnim.add("start").to(
                menu,
                {
                    top: "50vh",
                    duration: 1,
                    ease: CustomEase.create(
                        "custom",
                        "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                    ),
                },
                "start"
            );
        }
        return () => {
            menuDownAnim.kill();
        };
    }, []);

    const gamePlay = () => {
        setActive(false);

        menuDownAnim.reverse();
        if (gameMenuRef.current) {
            gsap.to(gameMenuRef.current, {
                backgroundColor: "#00000000",
                duration: 1,
                delay: 1,
            });
        }

        gsap.delayedCall(2, () => {
            setGameState(GAME_STATES.PLAYING);
        });
    };

    return (
        <GameMenu
            className={`${
                active ? "active" : "inactive"
            } absolute top-0 left-0 w-full h-full bg-[#00000059] flex justify-center pointer`}
            ref={gameMenuRef}
        >
            <div className="menu relative w-[28.7vw] h-[33vw] top-[-50vh] translate-y-[-50%]">
                <div className="button-col">
                    <button
                        className="warButton menuPlay"
                        name="play"
                        onClick={gamePlay}
                    />
                    <button className="warButton menuSetting" name="versus" />
                    <button className="warButton menuTraining" name="custom" />
                </div>
            </div>
        </GameMenu>
    );
};

export default GameMenuUI;
