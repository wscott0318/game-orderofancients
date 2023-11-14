import { useState } from "react";
import styled from "styled-components";
import Fireworks from "@fireworks-js/react";
import { PlayerData } from "../../../constants/gameUI";
import { Game } from "../game";
import { useGame } from "../../../hooks/useGame";
import playerImg1 from "../../../assets/users/jack.png";
import playerImg2 from "../../../assets/users/2.png";
import playerImg3 from "../../../assets/users/3.png";
import extBtnImg from "../../../assets/images/buttons/exit_btn.png";
import anotherBtnImg from "../../../assets/images/buttons/another_btn.png";
import victoryImg from "../../../assets/images/victory-logo.png";
import defeatImg from "../../../assets/images/defeat-logo.png";

const GameEnd = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background: rgb(0, 0, 0, 0.8);
    backdrop-filter: saturate(0.5);

    z-index: 999;
    display: flex;
    justify-content: center;

    .gameend {
        max-height: 80%;
        max-width: 80%;

        .vitory-logo {
            width: 650px;
            max-height: 55vh;
            max-width: 66vw;
        }

        .players {
            width: 470px;
            max-width: 100%;
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

                width: 300px;
                font-size: 30px;
            }
            .exit {
                background-image: url(${extBtnImg});
            }

            .playanother {
                background-image: url(${anotherBtnImg});
            }
        }

        @media only screen and (min-width: 1920px) {
            width: 658px;
            .players {
                top: -115.2px;
            }
            .player-name {
                height: 57.6px;
            }
            .buttons {
                top: -96px;
            }
        }
    }
`;

export const GameEndUI = () => {
    const { exitGameAction, restartGameAction, gameRef } = useGame();

    const game = gameRef.current!;

    /**
     * Win if player stands up for 30 seconds...
     */
    const isvictory =
        (game as Game)._timeManagerArray[game._playerIndex].totalTimeTracker >
        30;

    const [players, setPlayers]: [PlayerData[], any] = useState([
        {
            name: "Jack#2643",
            avata: playerImg1,
            color: "red",
            level: 80,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player2",
            avata: playerImg2,
            color: "blue",
            level: 90,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player3",
            avata: playerImg3,
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
            <div className="gameend h-fit flex flex-col items-center">
                <img
                    className="vitory-logo relative w-full"
                    src={isvictory ? victoryImg : defeatImg}
                />

                <div className="players relative top-[-6vw] w-[72%] ff-round">
                    <table className="w-[100%] text-center">
                        <tbody>
                            <tr className="head text-[#ecea8c] text-[17.4px]">
                                <td className="w-[50%]">Player</td>
                                <td className="w-[25%]">Kills</td>
                                <td className="w-[25%]">Income</td>
                            </tr>

                            {players.map(
                                (player: PlayerData, index: number) => (
                                    <tr
                                        style={{ color: player.color }}
                                        key={`player${index}`}
                                        className="text-[17.4px] bg-[#0007] h-[50px]"
                                    >
                                        <td className="player-name w-[50%] h-[50px] flex items-center pl-[5%] gap-[20%]">
                                            <img
                                                className="w-[30px]"
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

                <div
                    className="buttons relative top-[-5vw] flex font-bold"
                    style={{
                        justifyContent: isvictory ? "space-between" : "center",
                    }}
                >
                    <button
                        className="exit imageButton w-[45%] aspect-[652/170] text-[#ca663b]"
                        onClick={exitGameAction}
                    />

                    {isvictory && (
                        <button
                            className="playanother imageButton relative w-[45%] aspect-[652/170] text-[#e9c967]"
                            onClick={restartGameAction}
                        />
                    )}
                </div>
            </div>

            {isvictory && (
                <Fireworks className="absolute w-full h-full top-0 pointer-events-none" />
            )}
        </GameEnd>
    );
};

export default GameEndUI;
