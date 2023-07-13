import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../../constants/spell";
import { Game } from "../../game";
import { Desktop } from "./Desktop";

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

    // const setDetail = () => {
    //     const fieldBounding = document
    //         .querySelector(".field")
    //         ?.getBoundingClientRect() as any;
    //     setDetailPos({ x: fieldBounding.right + 10, y: fieldBounding.top });
    // };

    // useEffect(() => {
    //     setDetail();
    //     window.addEventListener("resize", setDetail);
    // }, []);

    // useEffect(() => {
    //     const detail = document.querySelector(".detail") as any;
    //     detail.style.left = `${detailPos.x}px`;
    //     detail.style.top = `${detailPos.y}px`;
    // }, [detailPos]);

    return (
        <>
            <BrowserView>
                <Desktop
                    upgrades={upgrades}
                    profileSpells={profileSpells}
                    players={players}
                    onClickUpgrade={onClickUpgrade}
                    playerShow={playerShow}
                    setPlayerShow={setPlayerShow}
                />
            </BrowserView>
            <MobileView></MobileView>
        </>
    );
};
export default GamePlayUI;
