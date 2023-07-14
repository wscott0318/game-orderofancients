import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import styled from "styled-components";
import { CustomProgressBar } from "../../../../theme/components";

const MobileGamePlay = styled.div`
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    top: 0px;
    pointer-events: none;
    background-size: 100% 100%;
    color: white;

    > div {
        pointer-events: all;
    }
    .spell {
        border-radius: 10px;
        border-width: 0.3vw;
        border-color: #634401;
    }
    .spell:active {
        transform: scale(0.95);
    }
`;

interface PlayerData {
    name: string;
    color: string;
    level: number;
    kills: number;
    income: number;
    wins: number;
    lastStands: number;
}

export const Mobile = ({
    upgrades,
    profileSpells,
    players,
    onClickUpgrade,
}: any) => {
    const [upgradeSpells, setUpgradeSpells]: [any[], any] = useState([]);

    useEffect(() => {
        const array = [];
        for (let i = 0; i < 12; i++) {
            if (upgrades[i]) {
                array.push(upgrades[i]);
            } else {
                array.push(null);
            }
        }
        setUpgradeSpells(array);
    }, [upgrades]);
    return (
        <MobileGamePlay className="gameplay_mobile">
            {/* -------  field start --------- */}
            <img
                src="/assets/images/mobile/back.png"
                className="plant absolute w-[89%] bottom-0 left-[50%] translate-x-[-50%]"
            />
            <img
                src="/assets/images/mobile/plant.png"
                className="plant absolute w-[92%] bottom-0 left-[50%] translate-x-[-50%]"
            />
            <div className="field absolute w-[87vw] h-[9vw] bottom-0 left-[50%] translate-x-[-50%] flex flex-col gap-[5%]">
                <div className="spells h-[80%] flex gap-[0.8%] pl-[0.8%]">
                    {upgradeSpells.map((el: any, index: number) => (
                        <div
                            key={`spell${index}`}
                            className=" w-[7.5%] flex items-center"
                        >
                            {el ? (
                                <img
                                    src={upgrades[index].thumbnail}
                                    alt="pic"
                                    className="spell w-full"
                                    onClick={() => {
                                        onClickUpgrade(el, index);
                                    }}
                                />
                            ) : (
                                <div className="spell bg-black aspect-square w-[100%]"></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="level_slider h-[20%] flex items-center">
                    <CustomProgressBar
                        borderRadius={"20px"}
                        trackColor={"#1252d5"}
                        value={40}
                    />
                </div>
            </div>
            {/* -------  field end --------- */}

            {/* -------  self start --------- */}
            <div className="self absolute left-[1.5vw] top-[1vw] flex flex-col gap-[1vw]">
                <div className="flex gap-[0.5vw]">
                    <img
                        src="/assets/images/profile.png"
                        className="w-[5.5vw] h-[5.5vw] rounded"
                    ></img>
                    <div className="fs-lg ff-round flex flex-col ">
                        <span>Jack555</span>
                        <span className="fc-orange">Level 1</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="inline-flex items-center">
                        <span className="fs-md">Armor: </span>{" "}
                        <span className="fc-orange fs-lg ff-round">10</span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="fs-md">Damage: </span>{" "}
                        <span className="fc-orange fs-lg ff-round">100</span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="fs-md">Range: </span>{" "}
                        <span className="fc-orange fs-lg ff-round">20</span>
                    </div>
                </div>
            </div>
            {/* -------  self end --------- */}
            {/* -------  health start --------- */}
            <div className="health absolute left-[21vw] top-[1vw] w-[17vw] h-[2.3vw]">
                <CustomProgressBar
                    value={75}
                    borderRadius={"4px"}
                    padding="1px"
                    trackColor="#489631"
                />
                <img
                    className="absolute h-[160%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                    src="/assets/images/heart.png"
                />
                <div className="absolute fs-md ff-round left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <span className="fc-orange">1450 </span>
                    <span className="">/ 1500</span>
                </div>
            </div>
            {/* -------  health end --------- */}

            {/* -------  coin start --------- */}
            <div className="coin absolute left-[44vw] top-[1vw] w-[13vw] h-[2.3vw]">
                <CustomProgressBar
                    value={0}
                    borderRadius={"4px"}
                    padding="1px"
                    trackColor="#489631"
                />
                <img
                    className="absolute h-[160%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                    src="/assets/images/coin-left.png"
                />
                <div className="absolute fs-md ff-round left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <span className="fc-orange" id="gold">
                        200 /
                    </span>
                    <span className=""> +80</span>
                </div>
            </div>
            {/* -------  coin end --------- */}

            {/* -------  clock start --------- */}
            <div className="clock absolute left-[63vw] top-[1vw] w-[12vw] h-[2.3vw]">
                <CustomProgressBar
                    value={0}
                    borderRadius={"4px"}
                    padding="1px"
                    trackColor="#489631"
                />
                <img
                    className="absolute h-[160%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                    src="/assets/images/clock.png"
                />
                <div className="absolute fs-md ff-round left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <span className="">00:00:55</span>
                </div>
            </div>
            {/* -------  clock end --------- */}

            {/* -------  player start --------- */}
            <div className="player absolute right-[3vw] top-[1vw] w-[12vw]  flex flex-col gap-[0.3vw]">
                {players.map((player: PlayerData, index: number) => (
                    <div className="relative" key={`player${index}`}>
                        <CustomProgressBar
                            height={"2.3vw"}
                            trackColor={player.color}
                            borderRadius="2px"
                            value={player.level}
                        />

                        <div className="absolute top-0 fs-sm w-[90%] flex left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ">
                            <span className="w-[50%]">{player.name}</span>
                            <span className="ff-round">100/</span>
                            <span className="ff-round fc-orange">
                                +{player.level}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {/* -------  player end --------- */}
        </MobileGamePlay>
    );
};
