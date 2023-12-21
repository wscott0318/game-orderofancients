import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { GAME_MODES, GAME_STATES, S3_BUCKET_URL } from "../../../constants";
import { useGameContext } from "../../../contexts/game-context";
import { SOCKET_EVENTS } from "../../../constants/socket";
import { Config } from "../../../utils/config";

const menuBack = S3_BUCKET_URL + "/assets/images/menu-back.png";
const btnBack = S3_BUCKET_URL + "/assets/images/button-back-bright.png";
const playBtn = S3_BUCKET_URL + "/assets/images/menuBtns/play.png";
const multiBtn = S3_BUCKET_URL + "/assets/images/menuBtns/multiplayer.png";
const settingBtn = S3_BUCKET_URL + "/assets/images/menuBtns/settings.png";
const traniningBtn = S3_BUCKET_URL + "/assets/images/menuBtns/tranining.png";
const singlePlayBtn = S3_BUCKET_URL + "/assets/images/menuBtns/single-play.png";

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

        &.menuSinglePlay {
            background-image: url(${singlePlayBtn});
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
    startMultiAction: () => void;
}

const GameMenuUI = ({ setGameState, startMultiAction }: GameMenuUIProps) => {
    const { socket, setGameMode } = useGameContext();

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

        gsap.delayedCall(1, () => {
            if (mode === GAME_MODES.Single) onClickSinglePlay();
            else if (mode === GAME_MODES.Lobby) startMultiAction();
        });
    };

    const onClickSinglePlay = () => {
        setGameMode(GAME_MODES.Single);

        socket?.emit(SOCKET_EVENTS.PLAY_SINGLE);
    };

    return (
        <GameMenu
            className={`${
                active ? "active" : "inactive"
            } absolute top-0 left-0 w-full h-full flex justify-center pointer`}
            ref={gameMenuRef}
        >
            <div className="menu relative top-[-50vh] translate-y-[-50%]">
                <div className="button-col">
                    <button
                        className="warButton imageButton menuPlay"
                        name="play"
                        onClick={() => gamePlay(GAME_MODES.Lobby)}
                    />

                    {Config.showSinglePlay && (
                        <button
                            className="warButton imageButton menuSinglePlay"
                            onClick={() => gamePlay(GAME_MODES.Single)}
                            disabled={!Config.showSinglePlay}
                        />
                    )}

                    <button
                        className="warButton imageButton menuSetting"
                        name="versus"
                        onClick={() => setGameState(GAME_STATES.SETTING)}
                        disabled
                    />
                    <button
                        className="warButton imageButton menuTraining"
                        name="custom"
                        disabled
                    />
                </div>
            </div>
        </GameMenu>
    );
};

export default GameMenuUI;
