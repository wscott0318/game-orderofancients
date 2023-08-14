import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GAME_STATES } from "../../../constants";
import Fireworks from "@fireworks-js/react";
import { PlayerData } from "../../../constants/gameUI";
import { Game } from "../game";

const GameEnd = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background: rgb(0, 0, 0, 0.8);
    backdrop-filter: saturate(0.5);

    z-index: 20;
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
                background-image: url("/assets/images/buttons/exit_btn.png");
            }

            .playanother {
                background-image: url("/assets/images/buttons/another_btn.png");
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

interface GameEndUIProps {
    gameRef: { current: Game };
    exitGameAction: () => void;
    restartGameAction: () => void;
}

export const GameEndUI = ({
    gameRef,
    exitGameAction,
    restartGameAction,
}: GameEndUIProps) => {
    const { current: game } = gameRef;

    /**
     * Win if player stands up for 30 seconds...
     */
    const isvictory = (game as Game)._timeManager.totalTimeTracker > 30;

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
            <div className="gameend h-fit flex flex-col items-center">
                <img
                    className="vitory-logo relative w-full"
                    src={
                        isvictory
                            ? "/assets/images/victory-logo.png"
                            : "/assets/images/defeat-logo.png"
                    }
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
