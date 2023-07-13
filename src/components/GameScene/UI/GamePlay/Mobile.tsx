import { gsap } from "gsap";
import { useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";

const MobileGamePlay = styled.div`
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    top: 0px;
    pointer-events: none;
    // background-image: url("/assets/images/mobile/1.jpg");
    background-size: 100% 100%;

    
    
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
    return (
        <MobileGamePlay className="gameplay_mobile">
            {/* <img
                src="/assets/images/mobile/back.png"
                className="plant absolute w-[89%] bottom-0 left-[50%] translate-x-[-50%]"
            />
            <img
                src="/assets/images/mobile/plant.png"
                className="plant absolute w-[92%] bottom-0 left-[50%] translate-x-[-50%]"
            /> */}

            <div className="field absolute w-[87vw] h-[9vw] bottom-0 left-[50%] translate-x-[-50%] flex flex-col gap-[5%]">
                <div className="spells h-[80%] bg-[#fff4]"></div>
                <div className="level_slider h-[20%] bg-[#fff4]">
                    <Slider />
                </div>
            </div>
        </MobileGamePlay>
    );
};
