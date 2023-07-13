import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";

const MobileGamePlay = styled.div`
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    top: 0px;
    // pointer-events: none;
    background-image: url("/assets/images/mobile/1.jpg");
    background-size: 100% 100%;

    .spell {
        border-radius: 10px;
        border-width: 5px;
        border-color: #634401;
    }
    .spell:active {
        transform: scale(0.95);
    }
`;
// const YellowBoldFont = styled.span`
//     color: #e9e502;
//     font-size: 15px;

//     @media only screen and (max-width: 1920px) {
//         font-size: 0.78vw;
//     }
// `;

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
    playerShow,
    setPlayerShow,
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
                    <Slider
                        value={50}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "80%",
                        }}
                        handleStyle={{ display: "none" }}
                        railStyle={{
                            backgroundColor: "black",
                            height: "100%",
                            borderRadius: "20px",
                        }}
                        trackStyle={{
                            backgroundColor: "#1252d5",
                            height: "83%",
                            borderRadius: "20px",
                        }}
                    />
                </div>
            </div>
            {/* -------  field end --------- */}
        </MobileGamePlay>
    );
};
