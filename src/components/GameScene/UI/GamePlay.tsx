import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../constants/spell";
import { Game } from "../game";

const GamePlay = styled.div`
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    top: 0px;
    pointer-events: none;

    .plant {
        background-image: url("/assets/images/bottom-plant.png");
        background-size: 100% 100%;
        left: 50vw;
        transform: translateX(-50%);
        pointer-event: none;
        width: 891px;
        height: 321px;

        @media only screen and (max-width: 1920px) {
            width: 46vw;
            height: 16.5vw;
        }
    }

    .back {
        pointer-events: all;
        background-image: url("/assets/images/bottom-back.png");
        background-size: 100% 100%;
        left: 50vw;
        transform: translateX(-50%);

        width: 873px;
        height: 266px;

        @media only screen and (max-width: 1920px) {
            width: 45vw;
            height: 14vw;
        }
    }

    .field {
        pointer-events: all;
        left: 50vw;
        transform: translateX(-50%);
        align-items: end;
        gap: 30px;

        width: 757px;
        height: 230px;

        @media only screen and (max-width: 1920px) {
            width: 40vw;
            height: 12.15vw;
        }

        .profile {
            width: 240px;
            height: 100%;
        }
        .status {
            width: 260px;
            height: 100%;
        }
        .spell {
            width: 300px;
            height: 100%;
        }
    }

    .spec {
        display: flex;
        flex-wrap: wrap;
        .item {
            border: solid 0.1vw darkgray;
            width: 23%;
            height: 31%;
            margin: 1%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .item:active {
            transform: scale(0.95);
        }
    }
    .roundfont {
        font-family: "Arial Rounded MT Bold";
    }

    .profileFont {
        font-size: 1.3vw;
    }
    .statusFont_big {
        font-size: 1.3vw;
    }
    .statusFont_small {
        font-size: 1vw;
    }
    .spellFont {
        font-size: 1vw;
    }

    @media only screen and (min-width: 1920px) {
        .profileFont {
            font-size: 25px;
        }
        .statusFont_big {
            font-size: 23px;
        }
        .statusFont_small {
            font-size: 15px;
        }
        .spellFont {
            font-size: 20px;
        }
    }

    .detail {
        width: 288px;
        height: 173px;
        position: absolute;
        background-color: #0004;
        border-radius: 5px;
        border-width: 2px;
        border-color: #2c322f;
        display: flex;
        flex-direction: column;
        color: white;

        .detail_title {
            height: 18%;
            display: flex;
            justify-content: space-between;
            padding-left: 5%;
            padding-right: 3%;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            padding-left: 5%;
            padding-right: 3%;
            align-items: center;

            .price {
                height: 100%;
                display: flex;
                align-items: center;
                img {
                    height: 80%;
                    margin-right: 10px;
                }
            }
        }
        .detail_data {
            height: 70%;
            border-top-width: 2px;
            border-top-color: #2c322f;
            font-size: 13px;
            display: flex;
            flex-direction: column;
            padding-left: 5%;

            p {
                height: 14%;
                display: flex;
                align-items: center;
            }

            p:nth-child(1) {
                height: 20%;
                font-size: 18px;
            }
            p:nth-child(7) {
                margin-top: 4%;
            }
            span {
                margin-left: 5%;
            }
        }

        @media only screen and (max-width: 1920px) {
            width: 15vw;
            height: 9vw;

            .detail_title {
                font-size: 0.78vw;
            }
            .detail_data {
                font-size: 0.67vw;
                p:nth-child(1) {
                    font-size: 0.93vw;
                }
            }
        }
    }

    .map {
        pointer-events: all;
        position: absolute;
        background-image: url("/assets/images/map-back.png");
        width: 24vw;
        height: 13vw;
        background-size: 100% 100%;
        bottom: 0;

        @media only screen and (min-width: 1920px) {
            width: 467px;
            height: 257px;
        }
    }
    .self {
        pointer-events: all;
        position: absolute;
        width: 4.15vw;
        margin: 1.03vw;

        .health {
            margin-top: 0.13vw;
            height: 0.26vw;
            background-color: red;
            border-radius: 10px;
        }
        .mana {
            margin-top: 0.13vw;
            height: 0.26vw;
            background-color: blue;
            border-radius: 10px;
        }
        @media only screen and (min-width: 1920px) {
            width: 80px;
            margin: 20px;

            .health {
                margin-top: 3px;
                height: 5px;
            }
            .mana {
                margin-top: 3px;
                height: 5px;
            }
        }
    }

    .player_stats {
        pointer-events: all;
        position: absolute;
        display: flex;
        flex-direction: column;

        right: 67px;
        top: 4.5vh;
        width: 401px;

        @media only screen and (max-width: 1920px) {
            right: 3.5vw;
            width: 20.9vw;
        }

        > div {
            background-color: #0004;
            border-radius: 5px;
            border-width: 2px;
            border-color: #2c322f;
            right: 0px;
        }

        .time {
            align-self: flex-end;
            color: #e9e502;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 5%;
            padding-right: 5%;
            width: 67%;

            height: 30px;

            @media only screen and (max-width: 1920px) {
                height: 1.56vw;
            }
        }

        .stats {
            width: 100%;
            color: #e9e502;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            top: 1vh;
            height: 30px;

            @media only screen and (max-width: 1920px) {
                height: 1.56vw;
            }

            .switch {
                position: absolute;
                right: 3%;
                cursor: pointer;
            }
        }
        .players {
            position: relative;
            transform-origin: top;
            padding-left: 2%;

            top: 1.9vh;
            font-size: 13px;
            @media only screen and (max-width: 1920px) {
                font-size: 0.68vw;
            }
            tr {
                width: 100%;
            }
            th {
                color: #919056;
            }
            td {
                text-align: center;
                font-size: 15px;

                @media only screen and (max-width: 1920px) {
                    font-size: 0.78vw;
                }
            }
            .level {
                width: 100%;

                height: 7px;

                background-color: black;
                > div {
                    background-color: #129110;
                    height: 100%;
                }
            }
        }
    }
`;

const YellowBoldFont = styled.span`
    color: #e9e502;
    font-size: 15px;

    @media only screen and (max-width: 1920px) {
        font-size: 0.78vw;
    }
`;

export const GradientText = styled.span`
    background: linear-gradient(to top #e56e16, #e9e502);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

interface GamePlayUIProps {
    gameRef: {
        current: Game;
    };
}

interface PlayerData {
    name: string;
    color: string;
    level: number;
    kills: number;
    income: number;
    wins: number;
    lastStands: number;
}
const GamePlayUI = ({ gameRef }: GamePlayUIProps) => {
    const [detailPos, setDetailPos]: [any, any] = useState({ x: 0, y: 0 });
    const playerDivRef = useRef<HTMLDivElement>(null);

    const [upgrades, setUpgrades] = useState([
        SPELLS_INFO["Throwing Axes"],
        SPELLS_INFO["Bow"],
        SPELLS_INFO["Magic_Missiles"],
        SPELLS_INFO["Boulder"],
        SPELLS_INFO["Chaos_Orb"],
        SPELLS_INFO["Missile_Barrage"],
        SPELLS_INFO["Flamecaster"],
        SPELLS_INFO["Chaos_Claw"],
        SPELLS_INFO[`Philosopher's Stone`],
    ]);
    const [profileSpells, setProfilSpells] = useState([
        SPELLS_INFO["Magic_Missiles"],
        SPELLS_INFO["Flamecaster"],
        SPELLS_INFO["Chaos_Claw"],
        SPELLS_INFO[`Philosopher's Stone`],
        SPELLS_INFO["Bow"],
    ]);
    const [playerShow, setPlayerShow]: [boolean, any] = useState(true);

    const [players, setPlayers]: [PlayerData[], any] = useState([
        {
            name: "Jack#2643",
            color: "red",
            level: 80,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player2",
            color: "blue",
            level: 90,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player3",
            color: "pink",
            level: 60,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
    ]);

    // const playControlDown = gsap.timeline();

    // useEffect(() => {
    //     playControlDown
    //         .add("start")
    //         .to(
    //             ".top-bar",
    //             {
    //                 top: "0px",
    //                 duration: 1,
    //             },
    //             "start"
    //         )
    //         .to(
    //             ".top-center",
    //             {
    //                 top: "0px",
    //                 duration: 1,
    //             },
    //             "start"
    //         )
    //         .to(
    //             ".bottom-bar",
    //             {
    //                 bottom: "0px",
    //                 duration: 1,
    //             },
    //             "start"
    //         );
    // }, []);

    const onClickUpgrade = (item: any, index: number) => {
        const gold_balance = gameRef.current._playerState.gold;

        const price = item.cost;

        if (gold_balance < price) return;

        gameRef.current._playerState.upgradeSpell(item);

        // Instant upgrades actions
        if (item.name === `Philosopher's Stone`) {
            gameRef.current._towerManager.sacrificeHealth(1000);
            gameRef.current._playerState.increaseGold(2000);
        }

        const newUpgrades = [...upgrades];
        (newUpgrades[index] as any).purchased = true;

        setUpgrades(newUpgrades);
    };

    const setDetail = () => {
        const fieldBounding = document
            .querySelector(".field")
            ?.getBoundingClientRect() as any;
        setDetailPos({ x: fieldBounding.right + 10, y: fieldBounding.top });
    };

    useEffect(() => {
        setDetail();
        window.addEventListener("resize", setDetail);
    }, []);

    useEffect(() => {
        const detail = document.querySelector(".detail") as any;
        detail.style.left = `${detailPos.x}px`;
        detail.style.top = `${detailPos.y}px`;
    }, [detailPos]);

    const switchPlayerShow = () => {
        if (playerDivRef.current) {
            const playerDiv = playerDivRef.current;

            if (playerShow) {
                gsap.to(playerDiv, {
                    transform: "ScaleY(0)",
                    duration: 0.5,
                });
            } else {
                gsap.to(playerDiv, {
                    transform: "ScaleY(1)",
                    duration: 0.5,
                });
            }
        }
        setPlayerShow(!playerShow);
    };

    return (
        <GamePlay className="gameplay">
            {/* ------- profile start --------- */}
            <div className="back fixed bottom-0 "></div>
            <div className="plant fixed bottom-0"></div>
            <div className="field fixed flex bottom-0">
                <div className="profile flex gap-[2%]">
                    <div className="left w-[20%] flex flex-col gap-[2%]">
                        {profileSpells.map((el: any, index: number) => (
                            <div
                                key={`profilespell${index}`}
                                className="relative max-h-[20%] h-[100%]"
                            >
                                <img width={"80%"} src={el.thumbnail}></img>
                                <div className="absolute w-[10%] h-[70%] bg-black top-0 left-[90%] border border-[#e7e103]"></div>
                            </div>
                        ))}
                    </div>

                    <div className="profile-data w-[78%] flex flex-col gap-[2%]">
                        <div className="h-[70%]">
                            <img
                                className="rounded"
                                src="/assets/images/profile.png"
                            ></img>
                        </div>
                        <div className="roundfont profileFont h-[28%] flex flex-col items-center justify-evenly bg-[#2226]">
                            <p className="text-white">Jacky555</p>
                            <p className="text-[#e9e502]">Level 1</p>
                        </div>
                    </div>
                </div>
                <div className="status flex flex-col gap-[2%] justify-center">
                    <div className="roundfont statusFont_big h-[20%] text-[#e9e502] font-bold text-center flex align-end justify-center items-end">
                        <p style={{ height: "min-content" }}>
                            Survivor's Status
                        </p>
                    </div>
                    <div className="relative h-[16%] flex justify-center items-center">
                        <div className="absolute border-4 border-[#252221] rounded-[15px] w-[100%] h-[100%] bg-black flex items-center">
                            <div
                                className="absolute left-[0.5%] w-[80%] h-[90%] rounded-[10px] "
                                style={{
                                    background:
                                        "linear-gradient(to bottom, #257808 0%, #299f1c 30%,#299f1c 70%, #1d7707 100%)",
                                }}
                            ></div>
                        </div>

                        <div className="absolute statusFont_small">
                            <span className="text-[#e9e502]">1450 </span>
                            <span className="text-white">/ 1500</span>
                        </div>
                    </div>
                    <div className="relative h-[30%]flex flex-col justify-center items-centers text-center">
                        <div className="statusFont_small">
                            <span className="text-white">{"Armor:  "}</span>
                            <span className="text-[#e9e502]"> 10</span>
                        </div>
                        <div className="statusFont_small">
                            <span className="text-white">{"Damage: "}</span>
                            <span className="text-[#e9e502]"> 100</span>
                        </div>
                        <div className="statusFont_small">
                            <span className="text-white">{"Range:    "}</span>
                            <span className="text-[#e9e502]"> 20</span>
                        </div>
                    </div>
                    <div className="h-[30%] flex items-center">
                        <div className="border-4 border-[#252221] rounded-[15px] w-[100%] h-[80%] bg-[#0005] flex justify-center items-center">
                            <img
                                src="/assets/images/coin.png"
                                className="h-[80%] "
                                style={{ marginRight: "10%" }}
                            ></img>
                            <div className="statusFont_big">
                                <span className="text-white" id="gold">
                                    200
                                </span>
                                <span className="text-white"> / </span>
                                <span className="text-[#e9e502]">+80</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="spell flex flex-col "
                    style={{
                        gap: "3%",
                        backgroundColor: "#25222144",
                    }}
                >
                    <div
                        // className="border-2 bg-[#1558e2] border-black"
                        style={{
                            height: "15%",
                            width: "100%",
                            borderWidth: "2px",
                            borderColor: "black",
                            background:
                                "linear-gradient(to bottom, #0e42ac 0%, #114fce 38%, #185ff1 83%, #114fce 100%)",
                            backgroundSize: `${40}%, 100%`,
                            backgroundPosition: "0, 0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div className="spellFont">
                            <span className="text-[#e9e502]"> 19s /</span>
                            <span className="text-white">20s</span>
                        </div>
                    </div>
                    <div
                        style={{
                            height: "82%",
                            width: "100%",
                        }}
                    >
                        <div className="spec">
                            {upgrades.map((item, index) => (
                                <div
                                    key={`upgradeItem${index}`}
                                    className={`${
                                        (item as any).purchased
                                            ? "opacity-0 pointer-events-none"
                                            : ""
                                    } item`}
                                    onClick={() => onClickUpgrade(item, index)}
                                >
                                    <img src={item.thumbnail} alt="pic" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* ------- profile end --------- */}

            {/* -------  detail start --------- */}
            <div className="detail">
                <div className="detail_title flex flex-row">
                    <span>
                        Throwing Axes ( <YellowBoldFont>Q</YellowBoldFont> )
                    </span>
                    <div className="price">
                        <img src="/assets/images/coin.png"></img>
                        <YellowBoldFont>500</YellowBoldFont>
                    </div>
                </div>
                <div className="detail_data">
                    <p>Weapon</p>
                    <p>
                        Damage Type: <YellowBoldFont> Normal</YellowBoldFont>
                    </p>
                    <p>
                        Damage: <YellowBoldFont> 75</YellowBoldFont>
                    </p>
                    <p>
                        DPS: <YellowBoldFont> 75</YellowBoldFont>
                    </p>
                    <p>
                        Attack Cooldown: <YellowBoldFont> 1.0</YellowBoldFont>
                    </p>
                    <p>
                        Range: <YellowBoldFont> 900</YellowBoldFont>
                    </p>
                    <p>
                        Target Reference:
                        <YellowBoldFont> Medium Armor</YellowBoldFont>
                    </p>
                </div>
            </div>
            {/* -------  detail end --------- */}

            {/* -------  map start --------- */}
            <div className="map"></div>
            {/* -------  map end --------- */}

            {/* -------  self start --------- */}
            <div className="self">
                <img src="/assets/images/profile.png"></img>
                <div className="health"></div>
                <div className="mana"></div>
            </div>
            {/* -------  self end --------- */}

            {/* -------  player_stats start --------- */}
            <div className="player_stats">
                <div className="time">
                    <YellowBoldFont>Time</YellowBoldFont>
                    <YellowBoldFont>00:00:55</YellowBoldFont>
                </div>
                <div className="stats">
                    <YellowBoldFont>stats</YellowBoldFont>
                    {playerShow ? (
                        <YellowBoldFont
                            className="switch"
                            onClick={switchPlayerShow}
                        >
                            ▲
                        </YellowBoldFont>
                    ) : (
                        <YellowBoldFont
                            className="switch"
                            onClick={switchPlayerShow}
                        >
                            ▼
                        </YellowBoldFont>
                    )}
                </div>
                <div className="players" ref={playerDivRef}>
                    <table className="player_tabel">
                        <tbody>
                            <tr>
                                <th
                                    style={{ width: "20%", textAlign: "start" }}
                                >
                                    Player
                                </th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "10%" }}>Kills</th>
                                <th style={{ width: "10%" }}>Income</th>
                                <th style={{ width: "10%" }}>Wins</th>
                                <th style={{ width: "30%" }}>last Stands</th>
                            </tr>

                            {players.map(
                                (player: PlayerData, index: number) => (
                                    <tr
                                        style={{ color: player.color }}
                                        key={`player${index}`}
                                    >
                                        <td
                                            style={{
                                                width: "20%",
                                                textAlign: "start",
                                            }}
                                        >
                                            {player.name}
                                        </td>
                                        <td style={{ width: "20%" }}>
                                            <div className="level">
                                                <div
                                                    style={{
                                                        width: `${player.level}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td style={{ width: "10%" }}>
                                            {player.kills}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                            {player.income}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                            {player.wins}
                                        </td>
                                        <td style={{ width: "20%" }}>
                                            {player.lastStands}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* -------  player_stats end --------- */}
        </GamePlay>
    );
};

export default GamePlayUI;
