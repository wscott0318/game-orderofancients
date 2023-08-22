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
    background-size: cover;
    background-position: center;
    animation: 2s alternate ${FadeIn};

    &.inactive {
        animation: 2s alternate ${FadeOut};
    }

    .menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: fit-content;
        height: fit-content;

        .backPic {
            width: 551px;
            position: relative;
        }
    }
    .button-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        height: 100%;
        padding-top: 13%;
        gap: 8%;
    }
    .warButton {
        width: 307px;
        max-width: 64%;

        font-weight: 900;
        user-select: none;

        img {
            width: 100%;
        }
    }
`;

interface GameMenuUIProps {
    setGameState: (state: number) => void;
    startGameAction: () => void;
}

const GameMenuUI = ({ setGameState, startGameAction }: GameMenuUIProps) => {
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
            startGameAction();
        });
    };

    return (
        <GameMenu
            className={`${
                active ? "active" : "inactive"
            } absolute top-0 left-0 w-full h-full bg-[#00000059] flex justify-center pointer`}
            ref={gameMenuRef}
        >
            <div className="menu relative top-[-50vh] translate-y-[-50%]">
                <img
                    className="backPic"
                    alt="pic"
                    src="/assets/images/menu-back.png"
                ></img>

                <div className="button-col">
                    <button
                        className="warButton imageButton"
                        name="play"
                        onClick={gamePlay}
                    >
                        <img
                            alt="pic"
                            src="/assets/images/menuBtns/play.png"
                        ></img>
                    </button>

                    <button
                        className="warButton imageButton"
                        name="versus"
                        onClick={() => setGameState(GAME_STATES.SETTING)}
                    >
                        <img
                            alt="pic"
                            src="/assets/images/menuBtns/settings.png"
                        ></img>
                    </button>

                    <button className="warButton imageButton" name="custom">
                        <img
                            alt="pic"
                            src="/assets/images/menuBtns/tranining.png"
                        ></img>
                    </button>
                </div>
            </div>
        </GameMenu>
    );
};

export default GameMenuUI;
