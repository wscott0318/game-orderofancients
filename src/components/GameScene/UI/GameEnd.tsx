import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GAME_STATES } from "../../../constants";
import Fireworks from "@fireworks-js/react";
import { PlayerData } from "../../../constants/gameUI";

const GameEnd = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    padding-left: 5%;
    width: 100vw;
    height: 100vh;
    background: rgb(0, 0, 0, 0.8);
    backdrop-filter: saturate(0.5);
    z-index: 20;
    justify-content: center;
    .players {
        background-color: #0004;
        border-radius: 5px;
        border-width: 2px;
        border-color: #697249;

        .head {
            border-bottom-width: 2px;
            border-bottom-color: #697249;
        }
    }
    .buttons {
        button {
            background-repeat: no-repeat;
            background-size: cover;
        }
        .exit {
            background-image: url("/assets/images/button-back-dark.png");
        }

        .playanother {
            background-image: url("/assets/images/button-back-bright.png");
        }
    }
`;

export const GameEndUI = ({ setGameState }: any) => {
    // const menuDownAnim = gsap.timeline();

    // useEffect(() => {
    //     menuDownAnim
    //         .add("start")
    //         .to(
    //             ".menu",
    //             {
    //                 top: "63px",
    //                 duration: 1,
    //                 ease: CustomEase.create(
    //                     "custom",
    //                     "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
    //                 ),
    //             },
    //             "start"
    //         )
    //         .to(
    //             ".chain",
    //             {
    //                 top: "-43px",
    //                 duration: 1,
    //                 ease: CustomEase.create(
    //                     "custom",
    //                     "M0,0,C0.53,0.512,0.846,1.448,1,1"
    //                 ),
    //             },
    //             "start"
    //         );

    //     return () => {
    //         menuDownAnim.kill();
    //     };
    //     // const container = document.querySelector("GameEnd");
    //     // const firework = new Fireworks(container, {})
    // }, []);

    // const resumeGame = () => {
    //     menuDownAnim.reverse();
    //     gsap.to(".gameMenu", {
    //         backgroundColor: "#00000000",
    //         duration: 1,
    //         delay: 1,
    //     });
    //     gsap.delayedCall(2, () => {
    //         setGameState(GAME_STATES.PLAYING);
    //     });
    // };

    // const restartGame = () => {
    //     menuDownAnim.reverse();
    //     gsap.to(".gameMenu", {
    //         backgroundColor: "#00000000",
    //         duration: 1,
    //         delay: 1,
    //     });
    //     gsap.delayedCall(2, () => {
    //         setGameState(GAME_STATES.GAME_MENU);
    //     });
    // };

    const [players, setPlayers]: [PlayerData[], any] = useState([
        {
            name: "Jack#2643",
            avata: "/assets/users/jack.png",
            color: "red",
            level: 80,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player2",
            avata: "/assets/users/2.png",
            color: "blue",
            level: 90,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player3",
            avata: "/assets/users/3.png",
            color: "pink",
            level: 60,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
    ]);

    return (
        <GameEnd className="GameEnd flex justify-center items-center">
            <div className="gameend w-[34%] h-fit flex flex-col items-center">
                <img
                    className="vitory-logo relative w-full"
                    src="/assets/images/victory-logo.png"
                />

                <div className="players relative top-[-6vw] w-[72%] ff-micro">
                    <table className="w-[100%] text-center">
                        <tbody>
                            <tr className="head text-[#919056] fs-sm">
                                <td className="w-[50%]">Player</td>
                                <td className="w-[25%]">Kills</td>
                                <td className="w-[25%]">Income</td>
                            </tr>

                            {players.map(
                                (player: PlayerData, index: number) => (
                                    <tr
                                        style={{ color: player.color }}
                                        key={`player${index}`}
                                        className="fs-md"
                                    >
                                        <td className="w-[50%] flex h-[3vw] flex items-center pl-[5%] gap-[20%]">
                                            <img
                                                className="h-[80%]"
                                                src={player.avata}
                                            />
                                            {player.name}
                                        </td>
                                        <td className="w-[25%]">
                                            {player.kills}
                                        </td>
                                        <td className="w-[25%]">
                                            {player.income}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="buttons relative top-[-5vw] flex justify-between w-[70%] fs-sm font-bold">
                    <button className="exit relative w-[45%] aspect-[652/170] text-[#ca663b]">
                        Exit Game
                    </button>
                    <button className="playanother relative w-[45%] aspect-[652/170] text-[#e9c967]">
                        Play Another
                    </button>
                </div>
            </div>
            {true && ( // is victory?
                <Fireworks className="absolute w-full h-full top-0 pointer-events-none" />
            )}
        </GameEnd>
    );
};

export default GameEndUI;
