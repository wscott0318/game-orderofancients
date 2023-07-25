import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";

import { GAME_STATES } from "../../../constants";

const GameSetting = styled.div`
    z-index: 20;
    background: rgb(0, 0, 0, 0.8);

    backdrop-filter: saturate(0.5);
    user-select: none;

    .setting {
        background-image: url("/assets/images/setting-back.png");
        background-size: 100% 100%;

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
            className="absolute top-0 left-0 w-full h-full flex justify-center"
            ref={gameSettingRef}
        >
            <div className="setting relative w-[60vw] h-[37vw] top-[50%] translate-y-[-50%] flex flex-col items-center">
                <div className="panel relative w-[80%] h-[64%] top-[17%]  flex flex-col">
                    <div className="navbar relative w-[100%] h-[8%] flex">
                        <button className="video h-[100%]"></button>
                        <button className="audio"></button>
                        <button className="players"></button>
                        <button className="controls"></button>
                    </div>
                    <div className="value relative w-[100%] h-[92%] border-[2px] border-[#ad794a] bg-[#0004] flex justify-center items-center">
                        <div className="relative h-[80%] w-[80%] flex flex-col">
                            <div className="h-[20%] w-full flex justify-between items-center  ff-micro fs-md">
                                <p className="text-white">Scrren Resolution</p>
                                <div className="w-[35%] h-[80%] bg-[#fff4]">
                                    <select
                                        name="resolution"
                                        className="resolutions"
                                    >
                                        <option value="volvo">
                                            1024 * 768
                                        </option>
                                        <option value="saab">
                                            1920 * 1080
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-micro fs-md">
                                <p className="text-white">Fullscreen</p>
                                <div className="fullscreen w-[35%] h-[80%] bg-[#fff4]">
                                    <div
                                        className="h-full aspect-square"
                                        style={{
                                            borderWidth: "2px",
                                            borderColor: "#2c322f",
                                            backgroundColor: "#0d0e10",
                                            padding: "2px",
                                        }}
                                    >
                                        <span className="fc-orange"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-micro fs-md">
                                <p className="text-white">Luminosity</p>
                                <div className="w-[35%] h-[80%] bg-[#fff4]"></div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-micro fs-md">
                                <p className="text-white">Target Framerate</p>
                                <div className="w-[35%] h-[80%] bg-[#fff4]"></div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-micro fs-md">
                                <p className="text-white">Display FPS</p>
                                <div
                                    className="w-[35%] h-[80%] bg-[#fff4]"
                                    style={{
                                        borderWidth: "2px",
                                        borderColor: "#2c322f",
                                        backgroundColor: "#0d0e10",
                                        padding: "2px",
                                    }}
                                >
                                    <div
                                        className="w-full h-full"
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
                    <button className="apply" />
                    <button className="default" />
                    <button className="exit" />
                </div>
            </div>
        </GameSetting>
    );
};

export default GameSettingUI;
