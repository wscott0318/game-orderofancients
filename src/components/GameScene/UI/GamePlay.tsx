import { gsap } from "gsap";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../constants/spell";
import { Game } from "../game";

const GamePlay = styled.div`
    position: fixed;
    z-index: 10;
    font-size: 1.3vw;
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
        height: 240px;

        @media only screen and (max-width: 1920px) {
            width: 40vw;
            height: 12.5vw;
        }

        div {
            position: relative;
            height: 100%;
            bottom: 0px;
            // background-color: #fff5;
        }

        .profile {
            width: 240px;
        }
        .status {
            width: 260px;
        }
        .spell {
            width: 300px;
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
                        <div className="h-[28%] flex flex-col items-center justify-evenly bg-[#2226]">
                            <p className="text-white">Jacky555</p>
                            <p className="text-[#e9e502]">Level 1</p>
                        </div>
                    </div>
                </div>
                <div className="status"></div>
                <div className="spell"></div>
            </div>
        </GamePlay>
    );
};

const ProfileLeft = ({ image, index }: any) => {
    return (
        <div className="max-h-[20%]" key={`profilespell${index}`}>
            <img width={"80%"} src={image}></img>
        </div>
    );
};
export default GamePlayUI;
