import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { PlayerData } from "../../../../constants/gameUI";
import { url } from "inspector";

const GamePlay = styled.div`
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    top: 0px;
    pointer-events: none;

    .back {
        pointer-events: all;
        background-image: url("/assets/images/gameui-spells-back.png");
        background-size: 100% 100%;
        left: 50vw;
        transform: translateX(-50%);

        width: 921.6px;
        height: 326.4px;

        @media only screen and (max-width: 1920px) {
            width: 48vw;
            height: 17vw;
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

            .left::-webkit-scrollbar {
                width: 5px;
                height: 10px;
                background-color: transparent;
            }

            .left::-webkit-scrollbar-thumb {
                background-color: black;
                border: 0.5px solid #ff0;
            }
        }
        .status {
            width: 260px;
            height: 100%;
        }
        .spell {
            width: 300px;
            height: 100%;

            .spec {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                height: 100%;

                .item {
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
        font-wie
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
                font-size: 11.5px;

                @media only screen and (max-width: 1920px) {
                    font-size: 0.6vw;
                }
            }
            .level {
                width: 80%;
                background-color: black;
                height: 5.7px;
                left: 50%;
                position: relative;
                transform: translateX(-50%);
                @media only screen and (max-width: 1920px) {
                    height: 0.3vw;
                }
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

const TimeBar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    // background: linear-gradient(
    //     to bottom,
    //     #0e42ac 0%,
    //     #114fce 38%,
    //     #185ff1 83%,
    //     #114fce 100%
    // );
    background-image: url("assets/images/spell-slider.png");
    background-size: auto 100%;
    transition: all 1s;
`;

export const Desktop = ({
    upgrades,
    profileSpells,
    players,
    onClickUpgrade,
    playerShow,
    setPlayerShow,
}: any) => {
    const playerDivRef = useRef<HTMLDivElement>(null);
    const switchPlayerShow = () => {
        // if (playerDivRef.current) {
        //     const playerDiv = playerDivRef.current;

        //     if (playerShow) {
        //         gsap.to(playerDiv, {
        //             transform: "ScaleY(0)",
        //             duration: 0.5,
        //         });
        //     } else {
        //         gsap.to(playerDiv, {
        //             transform: "ScaleY(1)",
        //             duration: 0.5,
        //         });
        //     }
        // }
        setPlayerShow(!playerShow);
    };
    const twelveArray = Array(12);
    const gameMenuFadeInAnim = gsap.timeline();

    useEffect(() => {
        gameMenuFadeInAnim
            .add("start")
            .from(".back", { bottom: "-16.5vw", duration: 0 }, "start")
            .from(".field", { bottom: "-16.5vw", duration: 0 }, "start")
            .from(".map", { left: "-24vw", duration: 0 }, "start")
            .from(".self", { top: "-6vw", duration: 0 }, "start")
            .from(".player_stats", { right: "-22vw", duration: 0 }, "start");

        return () => {
            gameMenuFadeInAnim.kill();
        };
    }, []);

    return (
        <GamePlay className="gameplay">
            {/* ------- profile start --------- */}
            <div className="back fixed bottom-0 "></div>
            <div className="field fixed flex bottom-0">
                <div className="profile flex gap-[2%]">
                    <div className="left relative w-[20%] h-[100%] flex flex-col gap-[5%] overflow-y-scroll">
                        {profileSpells.length > 12
                            ? profileSpells.map((el: any, index: number) => (
                                  <div
                                      key={`profilespell${index}`}
                                      className="relative h-[100px]"
                                  >
                                      <img
                                          width={"90%"}
                                          src={el.thumbnail}
                                      ></img>
                                  </div>
                              ))
                            : Array(12)
                                  .fill(1)
                                  .map((value: any, index: number) =>
                                      profileSpells[index] ? (
                                          <div
                                              key={`profilespell${index}`}
                                              className="w-[100%] aspect-square"
                                          >
                                              <img
                                                  width={"90%"}
                                                  src={
                                                      profileSpells[index]
                                                          .thumbnail
                                                  }
                                              ></img>
                                          </div>
                                      ) : (
                                          <div
                                              key={`profilespell${index}`}
                                              className="w-[100%]"
                                              style={{ height: "600%" }}
                                          >
                                              <img
                                                  width={"90%"}
                                                  src={
                                                      "assets/images/black.png"
                                                  }
                                              ></img>
                                          </div>
                                      )
                                  )}
                    </div>

                    <div className="profile-data w-[78%] flex flex-col gap-[2%]">
                        <div className="h-[70%]">
                            <img
                                className="rounded"
                                src="/assets/images/profile.png"
                            ></img>
                        </div>
                        <div className="roundfont fs-sm h-[28%] flex flex-col items-center justify-evenly bg-[#2226]">
                            <p className="text-white">Jacky555</p>
                            <p className="gradient-text1" id="gameLevel">
                                Level 1
                            </p>
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
                                id="towerHealthBar"
                                className="absolute w-[100%] h-[100%] rounded-[10px] border-[px] border-black"
                                style={{
                                    backgroundImage:
                                        "url('assets/images/status-slider.png')",
                                    backgroundSize: "auto 100%",
                                }}
                            ></div>
                        </div>

                        <div className="absolute statusFont_small">
                            <span className="text-[#e9e502]" id="currentHP">
                                1450{" "}
                            </span>
                            <span className="text-white" id="maxHP">
                                / 1500
                            </span>
                        </div>
                    </div>
                    <div className="relative h-[30%] w-[60%] flex flex-row statusFont_small gap-[30%] left-[50%] translate-x-[-50%]">
                        <div className="flex flex-col w-[50%] justify-center items-centers text-start ">
                            <span className="text-white">Armor:</span>
                            <span className="text-white">Damage:</span>
                            <span className="text-white">Range: </span>
                        </div>
                        <div className="flex flex-col w-[50%] justify-center items-centers text-start ">
                            <span className="text-[#e9e502]"> 10</span>
                            <span className="text-[#e9e502]"> 100</span>
                            <span className="text-[#e9e502]"> 20</span>
                        </div>
                    </div>
                    <div className="h-[30%] flex items-center">
                        <div className="border-4 border-[#252221] rounded-[15px] w-[100%] h-[80%] bg-[#0005] flex justify-center items-center">
                            <img
                                src="/assets/images/coin.png"
                                className="h-[60%]"
                                style={{ marginRight: "10%" }}
                            ></img>
                            <div className="statusFont_big">
                                <span className="text-white" id="gold">
                                    200
                                </span>
                                <span className="text-white"> / </span>
                                <span className="text-[#e9e502]" id="income">
                                    +80
                                </span>
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
                        className="relative"
                        style={{
                            height: "15%",
                            width: "100%",
                            borderWidth: "2px",
                            borderColor: "black",
                            background: "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TimeBar id="timeBar" />

                        <div className="spellFont relative">
                            <span
                                className="text-[#e9e502]"
                                id="remainingRoundTime"
                            >
                                19s
                            </span>
                            <span className="text-white"> / 30s</span>
                        </div>
                    </div>
                    <div className="specs relative w-full h-[80%]">
                        {/* <div className="absolute w-full h-full">
                            {Array(12)
                                .fill(1)
                                .map(() => (
                                    <div className="bg-black "></div>
                                ))}
                        </div> */}
                        <div className="spec absolute">
                            {Array(12)
                                .fill(1)
                                .map((value: any, index: number) =>
                                    upgrades[index] ? (
                                        <div
                                            key={`upgradeItem${index}`}
                                            className={`${
                                                (upgrades[index] as any)
                                                    .purchased
                                                    ? "opacity-0 pointer-events-none"
                                                    : ""
                                            } item hover:border-[1px] hover:border-[yellow]`}
                                            onClick={() =>
                                                onClickUpgrade(
                                                    upgrades[index],
                                                    index
                                                )
                                            }
                                        >
                                            <img
                                                src={upgrades[index].thumbnail}
                                                alt="pic"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-black m-[1%] w-[23%] h-[31%]"></div>
                                    )
                                )}
                        </div>
                    </div>
                </div>
            </div>
            {/* ------- profile end --------- */}

            {/* -------  detail start --------- */}
            {/* <div className="detail">
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
            </div> */}
            {/* -------  detail end --------- */}

            {/* -------  map start --------- */}
            {/* <div className="map"></div> */}
            {/* -------  map end --------- */}

            {/* -------  self start --------- */}
            {/* <div className="self">
                <img src="/assets/images/profile.png"></img>
                <div className="health"></div>
                <div className="mana"></div>
            </div> */}
            {/* -------  self end --------- */}

            {/* -------  player_stats start --------- */}
            <div className="player_stats">
                <div className="time">
                    <YellowBoldFont>Time</YellowBoldFont>
                    <YellowBoldFont id="elapsedTime">00:00:55</YellowBoldFont>
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
                {playerShow && (
                    <div className="players" ref={playerDivRef}>
                        <table className="player_tabel">
                            <tbody>
                                <tr>
                                    <th
                                        style={{
                                            width: "20%",
                                            textAlign: "start",
                                        }}
                                    >
                                        Player
                                    </th>
                                    <th style={{ width: "10%" }}></th>
                                    <th style={{ width: "10%" }}>Kills</th>
                                    <th style={{ width: "10%" }}>Income</th>
                                    <th style={{ width: "10%" }}>Wins</th>
                                    <th style={{ width: "30%" }}>
                                        last Stands
                                    </th>
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
                                            <td style={{ width: "30%" }}>
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
                )}
            </div>
            {/* -------  player_stats end --------- */}
        </GamePlay>
    );
};
