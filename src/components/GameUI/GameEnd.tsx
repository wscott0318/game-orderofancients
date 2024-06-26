
import styled from "styled-components";
import Fireworks from "@fireworks-js/react";

import { useGame } from "../../hooks/useGame";
import { GAME_MODES, GAME_STATES, PLAYER_COLOR, S3_BUCKET_URL } from "../../constants";
import { useGameContext } from "../../contexts/game-context";

const playerImg1 = S3_BUCKET_URL + "/assets/users/jack.png";
const playerImg2 = S3_BUCKET_URL + "/assets/users/2.png";
const playerImg3 = S3_BUCKET_URL + "/assets/users/3.png";
const extBtnImg = S3_BUCKET_URL + "/assets/images/buttons/exit_btn.png";
const anotherBtnImg = S3_BUCKET_URL + "/assets/images/buttons/another_btn.png";
const victoryImg = S3_BUCKET_URL + "/assets/images/victory-logo.png";
const defeatImg = S3_BUCKET_URL + "/assets/images/defeat-logo.png";

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

    const { exitGameAction, restartGameAction } = useGame();

    const { gameMode, currentGameState, lobbyInfo } = useGameContext();

    const isVictory = currentGameState === GAME_STATES.WON;

    //

    return (
        <GameEnd className="GameEnd flex justify-center items-center">
            <div className="gameend h-fit flex flex-col items-center">
                <img
                    className="vitory-logo relative w-full"
                    src={ isVictory ? victoryImg : defeatImg }
                />

                {gameMode === GAME_MODES.Lobby && (
                    <div className="players relative top-[-6vw] w-[72%] ff-round overflow-auto">
                        <table className="w-[100%] text-center">
                            <tbody>
                                <tr className="head text-[#ecea8c] text-[17.4px]">
                                    <td className="w-[50%]">Player</td>
                                    <td className="w-[25%]">Kills</td>
                                    <td className="w-[25%]">Income</td>
                                </tr>

                                {lobbyInfo?.players.map(
                                    (player: any, index: number) => (
                                        <tr
                                            style={{
                                                color: PLAYER_COLOR[index],
                                            }}
                                            key={`player${index}`}
                                            className="text-[17.4px] bg-[#0007] h-[50px]"
                                        >
                                            <td className="player-name w-[100%] h-[50px] flex items-center pl-[5%] gap-2 text-left">
                                                <img
                                                    className="w-[30px]"
                                                    src={playerImg1}
                                                />
                                                {player.name}
                                            </td>
                                            <td className="w-[25%]">2</td>
                                            <td className="w-[25%]">5</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div
                    className="buttons relative top-[-5vw] flex font-bold"
                    style={{
                        justifyContent: isVictory ? "space-between" : "center",
                    }}
                >
                    <button
                        className="exit imageButton w-[45%] aspect-[652/170] text-[#ca663b]"
                        onClick={exitGameAction}
                    />

                    { isVictory && (
                        <button
                            className="playanother imageButton relative w-[45%] aspect-[652/170] text-[#e9c967]"
                            onClick={restartGameAction}
                        />
                    )}
                </div>
            </div>

            { isVictory && (
                <Fireworks className="absolute w-full h-full top-0 pointer-events-none" />
            )}
        </GameEnd>
    );
};

export default GameEndUI;
