import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { GAME_MODES, GAME_STATES } from "../../../constants";
import loadingBack from "../../../assets/images/loading-back.png";
import menuBack from "../../../assets/images/menu-back.png";
import btnBack from "../../../assets/images/button-back-bright.png";
import playBtn from "../../../assets/images/menuBtns/play.png";
import multiBtn from "../../../assets/images/menuBtns/multiplayer.png";
import settingBtn from "../../../assets/images/menuBtns/settings.png";
import traniningBtn from "../../../assets/images/menuBtns/tranining.png";

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
    background-image: url(${loadingBack});
    background-size: cover;
    background-position: center;
    animation: 2s alternate ${FadeIn};

    &.inactive {
        animation: 2s alternate ${FadeOut};
    }

    .menu {
        display: flex;
        flex-direction: column;
        background-image: url(${menuBack});
        background-size: 100% 100%;
        align-items: center;

        width: 551px;
        height: 633px;
    }

    .button-col {
        position: relative;
        display: flex;
        flex-direction: column;

        gap: 17.6px;
        margin-top: 172px;
    }
    .warButton {
        cursor: url("../assets/imgs/gameCursor.png") !important;
        background-image: url(${btnBack});
        background-size: contain;
        background-repeat: no-repeat;
        background-size: cover;

        width: 307px;
        height: 80px;

        font-weight: 900;
        user-select: none;

        &.menuPlay {
            background-image: url(${playBtn});
        }

        &.menuMultiplayer {
            background-image: url(${multiBtn});
        }

        &.menuSetting {
            background-image: url(${settingBtn});
        }

        &.menuTraining {
            background-image: url(${traniningBtn});
        }
    }
`;

interface GameMenuUIProps {
    setGameState: (state: number) => void;
    startGameAction: () => void;
    startMultiAction: () => void;
}

const GameMenuUI = ({
    setGameState,
    startGameAction,
    startMultiAction,
}: GameMenuUIProps) => {
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

    const gamePlay = (mode: number) => {
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
            if (mode === GAME_MODES.Single) startGameAction();
            else if (mode === GAME_MODES.Lobby) startMultiAction();
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
                <div className="button-col">
                    <button
                        className="warButton imageButton menuPlay"
                        name="play"
                        onClick={() => gamePlay(GAME_MODES.Single)}
                    />

                    <button
                        className="warButton imageButton menuMultiplayer"
                        onClick={() => gamePlay(GAME_MODES.Lobby)}
                    />

                    <button
                        className="warButton imageButton menuSetting"
                        name="versus"
                        onClick={() => setGameState(GAME_STATES.SETTING)}
                    />
                    <button
                        className="warButton imageButton menuTraining"
                        name="custom"
                    />
                </div>
            </div>
        </GameMenu>
    );
};

export default GameMenuUI;
