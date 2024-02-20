
import { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import styled from "styled-components";

import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";
import { useGameContext } from "../../../contexts/game-context";
import { EventBridge } from "../../../libs/EventBridge";
import { Game } from "../../../game";
import { Network } from "../../../game/networking/NetworkHandler";

//

export const GradientText = styled.span`
    background: linear-gradient(to top #e56e16, #e9e502);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

//

const GamePlayUI = () => {

    const { upgrades, lobbyInfo } = useGameContext();

    const [profileSpells, setProfilSpells] = useState([]) as any;

    const [playerShow, setPlayerShow]: [boolean, any] = useState(true);

    const onClickUpgrade = (item: any, itemIndex: number) => {

        EventBridge.dispatchToGame( "upgradeSpell", { item, itemIndex } );

        const playerIndex = Game.instance._lobbyInfo.players.findIndex( ( player ) => player.socketId === Network.socket?.id );
        if ( playerIndex === undefined || playerIndex === -1 ) return;

        const playerState = Game.instance.towerManager.get( playerIndex ).playerState;
        const gold_balance = playerState.gold;
        const price = item.cost;

        if ( gold_balance < price ) return;

        if ( item.spellType === "Weapon" ) {

            const userSpells = [ ...profileSpells ];

            const index = userSpells.findIndex( ( spell: any ) => spell.name === item.name );

            if ( index !== -1 ) {

                userSpells[ index ].count ++;

            } else {

                userSpells.push({ ...item, count: 1, });

            }

            setProfilSpells( userSpells );

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
