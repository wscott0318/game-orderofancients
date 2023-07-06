import { gsap } from "gsap";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../constants/spell";
import { Game } from "../game";

const GamePlay = styled.div`
    position: fixed;
    z-index: 10;

    .top-bar {
        width: 100%;
        position: fixed;
        aspect-ratio: 1920 / 51;
        top: -100px;
        background-size: 100% auto;
        background-image: url("/assets/images/top-bar-remove-center.png");
    }
    .top-center {
        width: 6.8%;
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        aspect-ratio: 130 / 83;
        background-size: 100% auto;
        background-image: url("/assets/images/top-bar-center.png");
    }
    .bottom-bar {
        position: fixed;
        bottom: -400px;
        background-size: 100% auto;
        width: 100%;
        aspect-ratio: 1920 / 302;
        background-image: url(/assets/images/bottom-bar.png);
    }
    .spec {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 0.26vw;
        padding: 0.1vw 0.25vw;
        width: 16.5%;
        height: fit-content;
        max-height: 77%;
        top: 20%;
        left: 70%;
        .item {
            border: solid 0.1vw darkgray;
            width: 3.8vw;
            height: 3.7vw;

            img {
                width: 100%;
                height: 100%;
            }
        }
        .item:active {
            transform: scale(0.95);
        }
    }
    .status {
        font-size: 1.4vw;
        position: absolute;
        background-color: #ff000033;
        width: 18.5%;
        height: 68%;
        left: 41%;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        .name {
            position: relative;
            height: 20%;
            display: flex;
            color: white;
            justify-content: center;
        }
        .slider {
            height: 20%;
            background-color: #22222222;

            .progress {
                padding: 0.2vw 0.3vw;
                height: 100%;
                border: 0.1vw solid #ffff00;
                border-radius: 0.7vw;
                margin-left: 5%;
                margin-right: 5%;

                .progress-bar {
                    height: 100%;
                    background-image: linear-gradient(
                        0deg,
                        rgba(24, 34, 84, 1) 0%,
                        rgba(131, 138, 182, 1) 66%,
                        rgba(249, 249, 249, 1) 100%
                    );
                    width: 40%;
                }
            }
        }
        .others {
            position: relative;
            height: 60%;
            background-color: #33333333;
            color: yellow;
            display: flex;
            flex-direction: row;
            gap: 10%;
            padding: 5%;
            img {
                border: 0.1vw solid darkgray;
                padding: 1%;
            }
            ul li {
                font-size: 1.1vw;
                height: 30%;
            }
        }
    }
`;

const Gold = styled.div`
    position: absolute;
    transform: translate(-100%, -50%);
    left: 62.4%;
    top: 36%;
    z-index: 999;
    color: white;
    font-size: 1vw;
    text-align: right;
`;

interface GamePlayUIProps {
    gameRef: {
        current: Game;
    };
}

const GamePlayUI = ({ gameRef }: GamePlayUIProps) => {
    const playControlDown = gsap.timeline();

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

    useEffect(() => {
        playControlDown
            .add("start")
            .to(
                ".top-bar",
                {
                    top: "0px",
                    duration: 1,
                },
                "start"
            )
            .to(
                ".top-center",
                {
                    top: "0px",
                    duration: 1,
                },
                "start"
            )
            .to(
                ".bottom-bar",
                {
                    bottom: "0px",
                    duration: 1,
                },
                "start"
            );
    }, []);

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
            <div className="top-bar relative">
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
            </div>
        </GamePlay>
    );
};

export default GamePlayUI;
