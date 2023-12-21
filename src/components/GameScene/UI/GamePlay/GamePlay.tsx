import { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import styled from "styled-components";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";
import { useGame } from "../../../../hooks/useGame";
import { useGameContext } from "../../../../contexts/game-context";
import { useSocket } from "../../../../hooks/useSocket";
import { SOCKET_EVENTS } from "../../../../constants/socket";

export const GradientText = styled.span`
    background: linear-gradient(to top #e56e16, #e9e502);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const GamePlayUI = () => {
    const { upgrades, lobbyInfo } = useGameContext();
    const { gameRef } = useGame();
    const { socket } = useSocket();

    const [profileSpells, setProfilSpells] = useState([]) as any;

    const [playerShow, setPlayerShow]: [boolean, any] = useState(true);

    const onClickUpgrade = (item: any, itemIndex: number) => {
        socket?.emit(SOCKET_EVENTS.UPGRADE_SPELL, item, itemIndex);

        const playerIndex = lobbyInfo?.players.findIndex(
            (player) => player.socketId === socket?.id
        );
        if (playerIndex === undefined || playerIndex === -1) return;

        const playerState = gameRef.current!._playerStateArray[playerIndex];
        const gold_balance = playerState.gold;
        const price = item.cost;
        if (gold_balance < price) return;

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
    };

    return (
        <>
            <BrowserView>
                <Desktop
                    upgrades={upgrades}
                    profileSpells={profileSpells}
                    onClickUpgrade={onClickUpgrade}
                    playerShow={playerShow}
                    setPlayerShow={setPlayerShow}
                />
            </BrowserView>

            <MobileView>
                <Mobile
                    upgrades={upgrades}
                    profileSpells={profileSpells}
                    onClickUpgrade={onClickUpgrade}
                    playerShow={playerShow}
                    setPlayerShow={setPlayerShow}
                />
            </MobileView>
        </>
    );
};
export default GamePlayUI;
