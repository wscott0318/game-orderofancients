import "./index.scss";
import "./firefly.scss";
import { PlayerData } from "../../constants/gameUI";
import { useEffect, useState } from "react";
import { GET_RANDOM_VAL } from "../../helper/math";
import styled from "styled-components";

const playerInfo = [
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
    {
        name: "Player4",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
    {
        name: "Player5",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
    {
        name: "Player6",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
    {
        name: "Player7",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
    {
        name: "Player8",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
];

const TopLogo = styled.div`
    top: 0;
    width: 660px;
    max-width: 100%;
`;

const LoadingProgress = styled.div`
    max-width: 90%;
    width: 800px;
    bottom: 20px;
`;
const PlayerScrollDiv = styled.div`
    height: calc(100vh - 387px);
    .scroll {
        overflow-y: scroll;

        ::-webkit-scrollbar {
            width: 7px;
            background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #000;
            border: 1px solid #ddaf41;
            border-radius: 10px;
        }
    }
`;
export const Loader = ({ canEnterGame }: any) => {
    const [progressValue, setProgressValue] = useState(0);

    const [players, setPlayers]: [PlayerData[], any] = useState(playerInfo);

    // Firefly particle effects
    const renderFirefly = (count: number) => {
        const array = new Array(count);
        array.fill(1);

        return array.map((val: number, index: number) => (
            <div key={index} className="firefly"></div>
        ));
    };

    const handleProgress = () => {
        setTimeout(() => {
            handleProgress();

            setProgressValue((prev: number) =>
                prev + GET_RANDOM_VAL(10) + 10 > 95
                    ? 95
                    : prev + GET_RANDOM_VAL(10) + 10
            );
        }, (0.5 + GET_RANDOM_VAL(5) / 10) * 1000);
    };

    useEffect(() => {
        handleProgress();
    }, []);

    useEffect(() => {
        if (canEnterGame) {
            setProgressValue(100);
        }
    }, [canEnterGame]);

    return (
        <div className="loader">
            <div className="content z-20 relative select-none flex flex-col justify-between items-center">
                <div className="stars absolute">{renderFirefly(30)}</div>

                <TopLogo>
                    <img src="/assets/images/loading_logo.png" alt="logo" />
                </TopLogo>

                <PlayerScrollDiv className="players relative ff-round">
                    <div className="w-full h-full text-center border-separate border-spacing-y-[15px] flex flex-col gap-[5px]">
                        <div className="head text-[#ecea8c] text-[17.4px] flex">
                            <div className="w-[50%]">Player</div>
                            <div className="w-[25%]">Played</div>
                            <div className="w-[25%]">Win </div>
                        </div>
                        <div className="scroll">
                            {players.map(
                                (player: PlayerData, index: number) => (
                                    <div
                                        style={{
                                            color: "white",
                                            borderRadius: "5px",
                                            borderWidth: "2px",
                                            borderColor: "#2c322f",
                                        }}
                                        key={`player${index}`}
                                        className="text-[17.4px] bg-[#0007] flex p-1 my-2"
                                    >
                                        <div className="w-[50%] flex items-center gap-[20%]">
                                            <img
                                                width={40}
                                                src={player.avata}
                                            />
                                            <span>{player.name}</span>
                                        </div>
                                        <div className="w-[25%] flex justify-center items-center">
                                            <span>10</span>
                                        </div>
                                        <div className="w-[25%] flex justify-center items-center">
                                            <span>10</span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </PlayerScrollDiv>

                <LoadingProgress className="relative">
                    <CustomLoaderSlider
                        value={progressValue}
                        canEnterGame={canEnterGame}
                    />
                </LoadingProgress>

                <div
                    className={`pressAnyKey w-full text-center ${
                        canEnterGame ? "active" : ""
                    }`}
                >
                    PRESS ANY KEY
                </div>
            </div>
        </div>
    );
};

const CustomLoaderSlider = ({ value, canEnterGame }: any) => {
    return (
        <div className={`progress-container ${canEnterGame ? "hide" : ""}`}>
            <div
                className="progress h-full"
                style={{ backgroundSize: `${value}% 100%` }}
            />
            <img
                src="/assets/images/loader-slider-shine.png"
                style={{ left: `${value}%` }}
            />
            <p className="absolute text-white top-0 left-[50%] translate-x-[-50%] text-[24px] uppercase">
                Loading
            </p>
        </div>
    );
};
