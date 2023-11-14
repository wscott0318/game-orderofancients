import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../../constants/spell";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";
import { PlayerData } from "../../../../constants/gameUI";
import { useGame } from "../../../../hooks/useGame";
import { useGameContext } from "../../../../contexts/game-context";
import { useSocket } from "../../../../hooks/useSocket";
import { SOCKET_EVENTS } from "../../../../constants/socket";
import playerImg1 from "../../../../assets/users/jack.png";
import playerImg2 from "../../../../assets/users/2.png";
import playerImg3 from "../../../../assets/users/3.png";

export const GradientText = styled.span`
    background: linear-gradient(to top #e56e16, #e9e502);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const GamePlayUI = () => {
    const { upgrades, setUpgrades } = useGameContext();

    const { gameRef } = useGame();

    const { socket } = useSocket();

    const [profileSpells, setProfilSpells] = useState([]) as any;

    const [playerShow, setPlayerShow]: [boolean, any] = useState(true);

    const [players, setPlayers]: [PlayerData[], any] = useState([
        {
            name: "Jack#2643",
            avata: playerImg1,
            color: "red",
            level: 80,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player2",
            avata: playerImg2,
            color: "blue",
            level: 90,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player3",
            avata: playerImg3,
            color: "pink",
            level: 60,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
    ]);

    const onClickUpgrade = (item: any, index: number) => {
        socket?.emit(SOCKET_EVENTS.UPGRADE_SPELL, item, index);
    };

    const upgradeSpell = (...args: any[]) => {
        const item = args[0];
        const uiIndex = args[1];
        const playerIndex = args[2];

        const playerState = gameRef.current!._playerStateArray[playerIndex];

        const gold_balance = playerState.gold;
        const price = item.cost;
        if (gold_balance < price) return;

        playerState.upgradeSpell(item);

        /** Do action if it's me */
        if (playerIndex === gameRef.current!._playerIndex) {
            if (item.spellType === "Weapon") {
                const userSpells = [...profileSpells];
                const index = userSpells.findIndex(
                    (spell: any) => spell.name === item.name
                );
                if (index !== -1) {
                    userSpells[index].count++;
                } else {
                    userSpells.push({
                        ...item,
                        count: 1,
                    });
                }
                setProfilSpells(userSpells);
            }
        }

        // Instant upgrades actions
        if (
            item.name === `Philosopher's Stone` ||
            item.name === "Cursed Treasure"
        ) {
            gameRef.current!._towerManagerArray[playerIndex].sacrificeHealth(
                ((SPELLS_INFO as any)[item.propertyName] as any).sacrifiHealth
            );
            playerState.increaseUpgradeGold(item);
        }

        /** Do action if it's me */
        if (playerIndex === gameRef.current!._playerIndex) {
            const newUpgrades = [...upgrades];
            (newUpgrades[uiIndex] as any).purchased = true;
            setUpgrades(newUpgrades);
        }
    };

    useEffect(() => {
        socket?.on(SOCKET_EVENTS.UPGRADE_SPELL, upgradeSpell);

        return () => {
            socket?.off(SOCKET_EVENTS.UPGRADE_SPELL, upgradeSpell);
        };
    }, []);

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

            <MobileView>
                <Mobile
                    upgrades={upgrades}
                    profileSpells={profileSpells}
                    players={players}
                    onClickUpgrade={onClickUpgrade}
                    playerShow={playerShow}
                    setPlayerShow={setPlayerShow}
                />
            </MobileView>
        </>
    );
};
export default GamePlayUI;
