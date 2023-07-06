import { gsap } from "gsap";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../constants/spell";
import { Game } from "../game";

const GamePlay = styled.div`
    position: fixed;
    z-index: 10;

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
        // position: relative;
        display: flex;
        flex-wrap: wrap;
        // gap: 0.26vw;
        // padding: 0.1vw 0.25vw;
        // width: 16.5%;
        // height: fit-content;
        // max-height: 77%;
        // top: 20%;
        // left: 70%;
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
`;

// const Gold = styled.div`
//     position: absolute;
//     transform: translate(-100%, -50%);
//     left: 62.4%;
//     top: 36%;
//     z-index: 999;
//     color: white;
//     font-size: 1vw;
//     text-align: right;
// `;

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

const GamePlayUI = ({ gameRef }: GamePlayUIProps) => {
    // const playControlDown = gsap.timeline();

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

    return (
        <GamePlay className="gameplay">
            {/* <div className="top-bar relative">
                <Gold id="gold">0</Gold>
            </div>
            <div className="top-center"></div>
            <div className="bottom-bar">

                <div className="status">
                    <div className="name">Survicor's Shop</div>
                    <div className="slider">
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                    </div>
                    <div className="others">
                        <img src="/assets/images/rexar.png"></img>
                        <ul className="attributes">
                            <li>Armor: 10</li>
                            <li>Damage: 100</li>
                            <li>Range: 20</li>
                        </ul>
                    </div>
                </div>

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
            </div> */}

            <div className="back fixed bottom-0 "></div>

            <div className="plant fixed bottom-0"></div>

            <div className="field fixed flex bottom-0">
                <div className="profile flex gap-[2%]">
                    <div className="left w-[20%] flex flex-col gap-[2%]">
                        {profileSpells.map((el: any, index: number) => (
                            <ProfileLeft image={el.thumbnail} index={index} />
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
                                <span className="text-white"> 200/ </span>
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
        </GamePlay>
    );
};

const ProfileLeft = ({ image, index }: any) => {
    return (
        <div
            className="relative max-h-[20%] h-[100%]"
            key={`profilespell${index}`}
        >
            <img width={"80%"} src={image}></img>
            <div className="absolute w-[10%] h-[70%] bg-black top-0 left-[90%] border border-[#e7e103]"></div>
        </div>
    );
};
export default GamePlayUI;
