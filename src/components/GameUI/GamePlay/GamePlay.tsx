
import { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import styled from "styled-components";

import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";
import { useGameContext } from "../../../contexts/game-context";
import { GameMain } from "../../../game/main/GameMain";

//

export const GradientText = styled.span`
    background: linear-gradient(to top #e56e16, #e9e502);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

//

const GamePlayUI = () => {

    const { upgrades } = useGameContext();

    const [ profileSpells, setProfileSpells ] = useState( [] );
    const [ playerShow, setPlayerShow ] = useState( true );

    const onClickUpgrade = ( item: any, itemIndex: number ) => {

        GameMain.dispatchEvent( 'upgradeSpell', { item, itemIndex } );

        // todo
        // const playerIndex = GameMain.lobbyInfo.players.findIndex( ( player ) => player.socketId === Network.socket?.id );
        // if ( playerIndex === undefined || playerIndex === -1 ) return;

        // const playerState = GameMain.towerManager.get( playerIndex ).playerState;
        // const gold_balance = playerState.gold;
        // const price = item.cost;

        // if ( gold_balance < price ) return;

        // if ( item.spellType === 'Weapon' ) {

        //     const userSpells: any = [ ...profileSpells ];

        //     const index = userSpells.findIndex( ( spell: any ) => spell.name === item.name );

        //     if ( index !== -1 ) {

        //         userSpells[ index ].count ++;

        //     } else {

        //         userSpells.push({ ...item, count: 1, });

        //     }

        //     setProfileSpells( userSpells );

        // }

    };

    //

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
