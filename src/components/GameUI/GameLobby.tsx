
import styled from "styled-components";
import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef } from "react";

import { useGame } from "../../hooks/useGame";
import { GAME_STATES, S3_BUCKET_URL } from "../../constants";
import { useGameContext } from "../../contexts/game-context";
import { GameMain } from "../../game/main/GameMain";
import { GameEvents } from "../../game/Events";
import { LobbyInfo } from "../../game/Types";

gsap.registerPlugin(CustomEase);

const lobbyBackImg = S3_BUCKET_URL + "/assets/images/lobby-back.png";
const playerAvatar = S3_BUCKET_URL + "/assets/users/jack.png";
const exitBtnImg = S3_BUCKET_URL + "/assets/images/buttons/exit-inactive.png";

const Wrapper = styled.div`
    z-index: 20;
`;

const ContentWrapper = styled.div`
    width: 80%;
    left: 10%;
    top: 25%;
    height: 60%;
`;

const GameLobby = () => {

    const { setGameState } = useGame();
    const { lobbyInfo, setLobbyInfo, setUpgrades } = useGameContext();

    const divRef = useRef<HTMLDivElement>(null);
    const menuDownAnim = gsap.timeline();

    /**
     * Process events
     */

    useEffect( () => {

        setLobbyInfo( null );

        const setLobbyInfoCallback = ( lobby: LobbyInfo ) => {

            setLobbyInfo( lobby );

        };

        GameMain.addListener( GameEvents.SET_LOBBY_DATA, setLobbyInfoCallback );
        GameMain.addListener( GameEvents.SET_PLAYER_UPGRADES, setUpgrades );

        return () => {

            GameMain.removeListener( GameEvents.SET_LOBBY_DATA, setLobbyInfoCallback );
            GameMain.removeListener( GameEvents.SET_PLAYER_UPGRADES, setUpgrades );

        };

    }, []);

    //

    useEffect(() => {

        GameMain.dispatchEvent( GameEvents.LOBBY_JOIN );

        if (divRef.current) {

            const divElement = divRef.current.childNodes[0];

            menuDownAnim.add("start").from(divElement, {
                top: "-50vw",
                duration: 1,
                ease: CustomEase.create(
                    "custom",
                    "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                ),
            });

        }

        return () => {
            menuDownAnim.kill();
        };

    }, []);

    const onExit = () => {

        if ( divRef.current ) {

            const divElement = divRef.current.childNodes[0];

            menuDownAnim.add("end").to(divElement, {
                top: "-50vw",
                duration: 1,
                ease: CustomEase.create(
                    "custom",
                    "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                ),
            });

        }

        setTimeout(() => {

            setGameState( GAME_STATES.GAME_MENU );
            GameMain.dispatchEvent( GameEvents.LOBBY_EXIT_ROOM );

        }, 1000);

    };

    //

    return (
        <Wrapper
            className="w-full h-full flex justify-center items-center"
            ref={divRef}
        >
            <div className="relative w-[800px]">
                <img className="w-full" alt="pic" src={lobbyBackImg} />

                <ContentWrapper className="absolute top-0 left-0">
                    <div className="w-full h-full text-center border-separate border-spacing-y-[15px] flex flex-col gap-[5px]">
                        <div className="head text-[#ecea8c] text-[17.4px] flex">
                            <div className="w-[50%]">Player</div>
                            <div className="w-[25%]">Played</div>
                            <div className="w-[25%]">Win </div>
                        </div>
                        <div className="scroll h-[80%] overflow-auto">
                            {lobbyInfo?.players.map(
                                (player: any, index: number) => (
                                    <div
                                        style={{
                                            color: "white",
                                            borderRadius: "5px",
                                            borderWidth: "2px",
                                            borderColor:
                                                // player.socketId === socket?.id
                                                //     ? "#ffff00"
                                                    // : 
                                                    "#2c322f",
                                        }}
                                        key={`player${index}`}
                                        className="text-[17.4px] bg-[#0007] flex p-1 my-2"
                                    >
                                        <div className="w-[50%] flex items-center gap-[20%]">
                                            <img
                                                width={40}
                                                src={playerAvatar}
                                            />
                                            <span>{player.name}</span>
                                        </div>
                                        <div className="w-[25%] flex justify-center items-center">
                                            <span>10</span>
                                        </div>
                                        <div className="w-[25%] flex justify-center items-center">
                                            <span>10</span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-full">
                        <button
                            className="relative flex justify-center items-center w-[170px]"
                            onClick={onExit}
                        >
                            <img alt="pic" src={exitBtnImg} />
                        </button>
                    </div>
                </ContentWrapper>
            </div>
        </Wrapper>
    );
};

export default GameLobby;
