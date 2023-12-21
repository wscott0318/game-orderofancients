import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
    ARMOR_TYPES_TEXT,
    DAMAGE_TYPES_TEXT,
    GAME_MODES,
    PLAYER_COLOR,
    S3_BUCKET_URL,
} from "../../../../constants";
import { useGameContext } from "../../../../contexts/game-context";

const spellsBack = S3_BUCKET_URL + "/assets/images/gameui-spells-back.png";
const mapBack = S3_BUCKET_URL + "/assets/images/map-back.png";
const profile = S3_BUCKET_URL + "/assets/images/profile.png";
const coin = S3_BUCKET_URL + "/assets/images/coin.png";
const profileBack = S3_BUCKET_URL + "/assets/images/profile-name-back.png";
const blackImg = S3_BUCKET_URL + "/assets/images/black.png";
const spellSlider = S3_BUCKET_URL + "/assets/images/spell-slider.png";

const GamePlay = styled.div`
    position: fixed;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    top: 0px;
    pointer-events: none;

    .back {
        pointer-events: all;
        background-image: url(${spellsBack});
        background-size: 100% 100%;
        left: 50vw;
        transform: translateX(-50%);

        width: 921.6px;
        height: 326.4px;

        @media only screen and (max-width: 1024px) {
            width: 90vw;
            height: 31.8vw;
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

        @media only screen and (max-width: 1024px) {
            width: 74vw;
            height: 22.4vw;
        }

        .profile {
            width: 240px;
            height: 100%;

            .left {
                &::-webkit-scrollbar {
                    width: 5px;
                    background-color: transparent;
                    @media only screen and (max-width: 1024px) {
                        width: 0.5vw;
                    }
                }
    
                &::-webkit-scrollbar-thumb {
                    background-color: black;
                    border: 1px solid #ff0;
                }

                .profileSpellCount {
                    position: absolute;
                    right: 10%;
                    bottom: 0;
                    width: 15px;
                    height: 15px;
                    background: #000;
                    color: #ff0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .name{
                background-image: url(${profileBack});
                background-size: 100% 100%;
                background-repeat: no-repeat;
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
        font-size: 18px;
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

    @media only screen and (max-width: 1024px) {
        .profileFont {
            font-size: 1.76vw;
        }
        .statusFont_big {
            font-size: 2.27vw;
        }
        .statusFont_small {
            font-size: 1.46vw;
            font-wie
        }
        .spellFont {
            font-size: 1.95vw;
        }

        
    }

    .detail {
        width: 300px;
        position: absolute;
        background-color: #0004;
        border-radius: 5px;
        border-width: 2px;
        border-color: #2c322f;
        display: flex;
        flex-direction: column;
        color: white;
        bottom: -50px;
        right: 64px;

        @media only screen and (max-width: 1024px) {
            bottom: 31.8vw;
            right: 5vw;
        }

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
                    height: 25px;
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

        @media only screen and (max-width: 1024px) {
            width: 29.3vw;
            height: 16.9vw;

            .detail_title {
                font-size: 1.46vw;
            }
            .detail_data {
                font-size: 1.27vw;
                p:nth-child(1) {
                    font-size: 1.76vw;
                }
            }
        }
    }

    .map {
        pointer-events: all;
        position: absolute;
        background-image: url(${mapBack});
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

            tr {
                width: 100%;
            }

            th {
                color: #919056;
            }

            td {
                text-align: center;
                font-size: 11.5px;
            }

            .level {
                width: 80%;
                background-color: black;
                height: 5.7px;
                left: 50%;
                position: relative;
                transform: translateX(-50%);

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

    @media only screen and (max-width: 1024px) {
        font-size: 1.46vw;
    }
`;

const TimeBar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-image: url(${spellSlider});
    background-size: auto 100%;
    transition: all 1s;
`;

export const Desktop = ({
    upgrades,
    profileSpells,
    onClickUpgrade,
    playerShow,
    setPlayerShow,
}: any) => {
    const playerDivRef = useRef<HTMLDivElement>(null);
    const switchPlayerShow = () => {
        setPlayerShow(!playerShow);
    };
    const gameMenuFadeInAnim = gsap.timeline();
    const [hoveredSpell, setHoveredSpell]: [any, any] = useState(null);

    const { gameMode, lobbyInfo } = useGameContext();

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

    const spellEnter = (spell: any) => {
        setHoveredSpell(spell);
    };
    const spellLeave = () => {
        setHoveredSpell(null);
    };
    return (
        <GamePlay className="gameplay">
            {/* ------- profile start --------- */}
            <div className="back fixed bottom-0">
                {/* -------  detail start --------- */}
                <div className="relative">
                    {hoveredSpell && (
                        <div className="detail">
                            <div className="detail_title flex flex-row py-2">
                                <span>{hoveredSpell.name}</span>
                                <div className="price">
                                    <img src={coin}></img>
                                    <YellowBoldFont>
                                        {hoveredSpell.cost}
                                    </YellowBoldFont>
                                </div>
                            </div>
                            <div className="detail_data py-2">
                                {hoveredSpell.spellType === "Upgrade" ? (
                                    <>
                                        <p className="mb-2">
                                            {hoveredSpell.spellType}
                                            {`( `}
                                            <span
                                                style={{
                                                    margin: 0,
                                                    color: "#e9e502",
                                                }}
                                            >
                                                {hoveredSpell.upgradeType}
                                            </span>
                                            {` )`}
                                        </p>

                                        <p>{hoveredSpell.description}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-2">
                                            {hoveredSpell.spellType}
                                        </p>
                                        <p>
                                            Damage Type:{" "}
                                            <YellowBoldFont>
                                                {
                                                    DAMAGE_TYPES_TEXT[
                                                        hoveredSpell.damageType as keyof typeof DAMAGE_TYPES_TEXT
                                                    ]
                                                }
                                            </YellowBoldFont>
                                        </p>
                                        <p>
                                            Damage:{" "}
                                            <YellowBoldFont>
                                                {hoveredSpell.attackDamage}
                                            </YellowBoldFont>
                                        </p>
                                        <p>
                                            DPS:{" "}
                                            <YellowBoldFont>
                                                {hoveredSpell.dps}
                                            </YellowBoldFont>
                                        </p>
                                        <p>
                                            Attack Cooldown:{" "}
                                            <YellowBoldFont>
                                                {hoveredSpell.cooldown}
                                            </YellowBoldFont>
                                        </p>
                                        <p>
                                            Range:{" "}
                                            <YellowBoldFont>
                                                {hoveredSpell.attackRange}
                                            </YellowBoldFont>
                                        </p>
                                        <p>
                                            Target Reference:
                                            <YellowBoldFont>
                                                {!hoveredSpell.targetPreference
                                                    ? "Any"
                                                    : ARMOR_TYPES_TEXT[
                                                          hoveredSpell.targetPreference as keyof typeof ARMOR_TYPES_TEXT
                                                      ]}
                                            </YellowBoldFont>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="field fixed flex bottom-0">
                <div className="profile flex gap-[2%]">
                    <div className="left relative w-[20%] h-[100%] flex flex-col gap-[5%] overflow-y-scroll">
                        {profileSpells.length > 12
                            ? profileSpells.map((el: any, index: number) => (
                                  <div
                                      key={`profilespell${index}`}
                                      className="relative h-[100px] relative"
                                  >
                                      <img
                                          width={"90%"}
                                          src={el.thumbnail}
                                      ></img>

                                      <div className="profileSpellCount">
                                          {profileSpells[index].count}
                                      </div>
                                  </div>
                              ))
                            : Array(12)
                                  .fill(1)
                                  .map((value: any, index: number) =>
                                      profileSpells[index] ? (
                                          <div
                                              key={`profilespell${index}`}
                                              className="w-[100%] aspect-square relative"
                                          >
                                              <img
                                                  width={"90%"}
                                                  src={
                                                      profileSpells[index]
                                                          .thumbnail
                                                  }
                                              ></img>

                                              <div className="profileSpellCount">
                                                  {profileSpells[index].count}
                                              </div>
                                          </div>
                                      ) : (
                                          <div
                                              key={`profilespell${index}`}
                                              className="w-[100%]"
                                              style={{ height: "600%" }}
                                          >
                                              <img
                                                  width={"90%"}
                                                  src={blackImg}
                                              ></img>
                                          </div>
                                      )
                                  )}
                    </div>

                    <div className="profile-data w-[78%] flex flex-col gap-[2%]">
                        <div className="h-[70%]">
                            <img className="rounded" src={profile}></img>
                        </div>
                        <div className="name roundfont profileFont h-[28%] flex flex-col items-center justify-evenly">
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
                    <div className="relative h-[30%] w-[60%] flex flex-row statusFont_small gap-[30%] left-[50%] translate-x-[-50%]"></div>
                    <div className="h-[30%] flex items-center">
                        <div
                            className="gold w-[100%] h-[80%] flex justify-center items-center"
                            style={{
                                backgroundImage:
                                    "url('assets/images/status-gold-back.png')",
                                backgroundSize: "100% 100%",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <img
                                src={coin}
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
                        <div className="spec absolute">
                            {Array(12)
                                .fill(1)
                                .map((value: any, index: number) =>
                                    upgrades[index] ? (
                                        <div
                                            key={`upgradeItem${index}`}
                                            className={`item border-[1px] border-[transparent] hover:border-[1px] hover:border-[yellow]`}
                                            style={{
                                                filter: upgrades[index]
                                                    .purchased
                                                    ? `brightness(0.1)`
                                                    : `brightness(1)`,
                                            }}
                                            onClick={() => {
                                                setHoveredSpell(null);

                                                onClickUpgrade(
                                                    upgrades[index],
                                                    index
                                                );
                                            }}
                                            onMouseEnter={() => {
                                                spellEnter(upgrades[index]);
                                            }}
                                            onMouseLeave={() => {
                                                spellLeave();
                                            }}
                                        >
                                            <img
                                                src={upgrades[index].thumbnail}
                                                alt="pic"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            key={`upgradeItemBlack${index}`}
                                            className="bg-black m-[1%] w-[23%] h-[31%]"
                                        ></div>
                                    )
                                )}
                        </div>
                    </div>
                </div>
            </div>
            {/* ------- profile end --------- */}

            {/* -------  player_stats start --------- */}
            <div className="player_stats">
                <div className="time">
                    <YellowBoldFont>Time</YellowBoldFont>
                    <YellowBoldFont id="elapsedTime">00:00:55</YellowBoldFont>
                </div>

                {gameMode === GAME_MODES.Lobby && (
                    <>
                        <div className="stats">
                            <YellowBoldFont>Stats</YellowBoldFont>
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
                                            <th style={{ width: "10%" }}>
                                                Kills
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                Income
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                Wins
                                            </th>
                                            <th style={{ width: "30%" }}>
                                                last Stands
                                            </th>
                                        </tr>

                                        {lobbyInfo?.players.map(
                                            (player: any, index: number) => (
                                                <tr
                                                    style={{
                                                        color: PLAYER_COLOR[
                                                            index
                                                        ],
                                                    }}
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
                                                    <td
                                                        style={{ width: "30%" }}
                                                    >
                                                        <div className="level">
                                                            <div
                                                                className="status_player_health"
                                                                style={{
                                                                    width: `100%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        style={{ width: "10%" }}
                                                    >
                                                        5
                                                    </td>
                                                    <td
                                                        style={{ width: "10%" }}
                                                    >
                                                        2
                                                    </td>
                                                    <td
                                                        style={{ width: "10%" }}
                                                    >
                                                        0
                                                    </td>
                                                    <td
                                                        style={{ width: "20%" }}
                                                    >
                                                        0
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* -------  player_stats end --------- */}
        </GamePlay>
    );
};
