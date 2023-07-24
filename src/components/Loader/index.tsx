import "./index.scss";
import "./firefly.scss";
import { PlayerData } from "../../constants/gameUI";
import { useState } from "react";

export const Loader = ({ canEnterGame }: any) => {
    const renderFirefly = (count: number) => {
        const array = new Array(count);
        array.fill(1);
        return array.map((val: number, index: number) => (
            <div key={index} className="firefly"></div>
        ));
    };
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
            name: "Jack#2643",
            avata: "/assets/users/jack.png",
            color: "red",
            level: 80,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
    ]);
    return (
        <div className="loader">
            <div className="content z-20 relative select-none flex justify-center items-center">
                <div className="stars">{renderFirefly(30)}</div>
                {/* <div className="image-wrapper shine">
                    <img src="/assets/images/logo.png" alt="background" />
                </div> */}

                {/* <div
                    className={`progress-container ${
                        canEnterGame ? "hide" : ""
                    }`}
                >
                    <div className="progress2 progress-moved">
                        <div className="progress-bar2"></div>
                    </div>
                </div> */}

                {/* <div className={`pressAnyKey ${canEnterGame ? "active" : ""}`}>
                    PRESS ANY KEY
                </div> */}

                <div className="w-[60vw] flex flex-col items-center">
                    <img
                        className="w-[50%]"
                        src="/assets/images/logo2.png"
                        alt="logo"
                    />

                    <div className="players relative w-[60%] ff-micro">
                        <div className="w-[100%] text-center border-separate border-spacing-y-[15px] flex flex-col gap-[10px]">
                            <div className="head text-[#919056] fs-sm flex">
                                <div className="w-[50%]">Player</div>
                                <div className="w-[25%]">Played</div>
                                <div className="w-[25%]">Win </div>
                            </div>

                            {players.map(
                                (player: PlayerData, index: number) => (
                                    <div
                                        style={{
                                            color: player.color,
                                            borderRadius: "5px",
                                            borderWidth: "2px",
                                            borderColor: "#2c322f",
                                        }}
                                        key={`player${index}`}
                                        className="fs-md bg-[#0004] flex"
                                    >
                                        <div className="w-[50%] flex h-[3vw] flex items-center pl-[5%] gap-[20%]">
                                            <img
                                                className="h-[80%]"
                                                src={player.avata}
                                            />
                                            {player.name}
                                        </div>
                                        <div className="w-[25%]">10</div>
                                        <div className="w-[25%]">10</div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div
                        className={`progress-container ${
                            canEnterGame ? "hide" : ""
                        }`}
                    >
                        <div className="progress2 progress-moved">
                            <div className="progress-bar2"></div>
                        </div>
                    </div>

                    <div
                        className={`pressAnyKey ${
                            canEnterGame ? "active" : ""
                        }`}
                    >
                        PRESS ANY KEY
                    </div>
                </div>
            </div>
        </div>
    );
};
