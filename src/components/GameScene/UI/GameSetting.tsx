import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import ReactSlider from "react-slider";
import "../../../theme/slider.scss";

import { GAME_STATES } from "../../../constants";

const GameSetting = styled.div`
    z-index: 20;
    background-image: url("/assets/images/loading-back.png");
    background-size: cover;
    background-position: center;
    user-select: none;

    .setting {
        background-image: url("/assets/images/setting-back.png");
        background-size: 100% 100%;

        width: 60vw;
        height: 37vw;

        @media only screen and (min-width: 1920px) {
            width: 1152px;
            height: 710px;
        }

        .panel {
            .navbar {
                button {
                    aspect-ratio: 385/88;
                    background-size: 100% 100%;
                }

                .video {
                    background-image: url("/assets/images/buttons/setting-video.png");
                }
                .audio {
                    background-image: url("/assets/images/buttons/setting-audio-inactive.png");
                }
                .players {
                    background-image: url("/assets/images/buttons/setting-players-inactive.png");
                }
                .controls {
                    background-image: url("/assets/images/buttons/setting-controls-inactive.png");
                }
            }
            .value {
                border-radius: 3%/7%;
                border-top-left-radius: 0px;

                .resolutions {
                    width: 100%;
                    height: 100%;
                    background: #0d0e10;
                    color: yellow;
                    border-width: 2px;
                    border-color: #2c322f;
                }
            }
        }

        .buttons {
            button {
                aspect-ratio: 385/106;
                background-size: 100% 100%;
            }
            .apply {
                background-image: url("/assets/images/buttons/apply-inactive.png");
            }
            .default {
                background-image: url("/assets/images/buttons/default-inactive.png");
            }
            .exit {
                background-image: url("/assets/images/buttons/exit-inactive.png");
            }
        }
    }
`;

interface GameSettingUIProps {
    setGameState: (state: number) => void;
}

const GameSettingUI = ({ setGameState }: GameSettingUIProps) => {
    const gameSettingRef = useRef<HTMLDivElement>(null);
    const menuDownAnim = gsap.timeline();

    useEffect(() => {
        if (gameSettingRef.current) {
            const setting = gameSettingRef.current.childNodes[0];

            menuDownAnim.add("start").from(
                setting,
                {
                    top: "-50vw",
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

    const exit = () => {
        menuDownAnim.reverse();

        gsap.delayedCall(1, () => {
            setGameState(GAME_STATES.GAME_MENU);
        });
    };

    return (
        <GameSetting
            className="absolute top-0 left-0 w-full h-full flex justify-center"
            ref={gameSettingRef}
        >
            <div className="setting relative top-[50%] translate-y-[-50%] flex flex-col items-center">
                <div className="panel relative w-[80%] h-[64%] top-[17%]  flex flex-col">
                    <div className="navbar relative w-[100%] h-[8%] flex">
                        <button className="video h-[100%]"></button>
                        <button className="audio"></button>
                        <button className="players"></button>
                        <button className="controls"></button>
                    </div>
                    <div className="value relative w-[100%] h-[92%] border-[2px] border-[#ad794a] bg-[#0004] flex justify-center items-center">
                        <div className="relative h-[80%] w-[80%] flex flex-col">
                            <div className="h-[20%] w-full flex justify-between items-center  ff-round fs-md">
                                <p className="text-white">Screen Resolution</p>
                                <div className="w-[35%] h-[80%] shadow-[2px_3px_rgba(0,0,0,0.3)]">
                                    <select
                                        name="resolution"
                                        className="resolutions"
                                    >
                                        <option value="volvo">
                                            1024 x 768
                                        </option>
                                        <option value="saab">
                                            1920 x 1080
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-round fs-md">
                                <p className="text-white">Fullscreen</p>
                                <div className="fullscreen w-[35%] h-[80%] ">
                                    <div
                                        className="h-full aspect-square shadow-[2px_3px_rgba(0,0,0,0.3)]"
                                        style={{
                                            borderWidth: "2px",
                                            borderColor: "#2c322f",
                                            backgroundColor: "#0d0e10",
                                            padding: "2px",
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                scale: "1.5",
                                                cursor: "pointer",
                                                // visibility: "hidden",
                                            }}
                                            fill="yellow"
                                        >
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center ff-round fs-md">
                                <p className="text-white">Luminosity</p>
                                <div className="w-[35%] h-[80%]  flex items-center ">
                                    <ReactSlider
                                        className="horizontal-slider shadow-[2px_3px_rgba(0,0,0,0.3)]"
                                        thumbClassName="example-thumb"
                                        trackClassName="example-track"
                                        max={5}
                                        defaultValue={[1.5]}
                                        // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                    />
                                    <p className="absolute fc-orange right-0 translate-x-[30px]">
                                        1.50
                                    </p>
                                </div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center ff-round fs-md">
                                <p className="text-white">Target Framerate</p>
                                <div className="w-[35%] h-[80%]  flex items-center">
                                    <ReactSlider
                                        className="horizontal-slider shadow-[2px_3px_rgba(0,0,0,0.3)]"
                                        thumbClassName="example-thumb"
                                        trackClassName="example-track"
                                        max={5}
                                        defaultValue={[1.5]}
                                        // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                    />
                                    <p className="absolute fc-orange right-0 translate-x-[30px]">
                                        1.50
                                    </p>
                                </div>
                            </div>

                            <div className="h-[20%] w-full flex justify-between items-center  ff-round fs-md">
                                <p className="text-white">Display FPS</p>
                                <div
                                    className="w-[35%] h-[80%] "
                                    style={{
                                        borderWidth: "2px",
                                        borderColor: "#2c322f",
                                        backgroundColor: "#0d0e10",
                                        padding: "2px",
                                    }}
                                >
                                    <div
                                        className="w-full h-full shadow-[2px_3px_rgba(0,0,0,0.3)]"
                                        style={{
                                            background:
                                                "linear-gradient(to right, #000, #e9e502)",
                                            backgroundSize: `${50}% 100%`,
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons relative w-[50%] h-[7%] top-[20%] flex justify-between">
                    <button className="imageButton apply" />
                    <button className="imageButton default" />
                    <button className="imageButton exit" onClick={exit} />
                </div>
            </div>
        </GameSetting>
    );
};

export default GameSettingUI;
