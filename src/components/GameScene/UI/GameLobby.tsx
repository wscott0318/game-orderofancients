import styled from "styled-components";
import { useSocket } from "../../../hooks/useSocket";
import { useEffect } from "react";
import { SOCKET_EVENTS } from "../../../constants/socket";
import { useGame } from "../../../hooks/useGame";
import { GAME_STATES } from "../../../constants";
import { LobbyInfo, useGameContext } from "../../../contexts/game-context";
import backImg from "../../../assets/images/loading-back.png";
import lobbyBackImg from "../../../assets/images/lobby-back.png";
import playerAvatar from "../../../assets/users/jack.png";
import exitBtnImg from "../../../assets/images/buttons/exit-inactive.png";

const Wrapper = styled.div`
    z-index: 20;
    background-image: url(${backImg});
    background-size: cover;
    background-position: center;
`;

const ContentWrapper = styled.div`
    width: 80%;
    left: 10%;
    top: 25%;
    height: 60%;
`;

interface GameLobbyProps {
    startLobbyGame: () => void;
}

const GameLobby = ({ startLobbyGame }: GameLobbyProps) => {
    const { socket } = useSocket();

    const { setGameState } = useGame();
    const { lobbyInfo, setLobbyInfo } = useGameContext();

    const receiveLobbyData = (lobby: LobbyInfo) => {
        setLobbyInfo(lobby);
    };

    const startGame = (lobby: LobbyInfo) => {
        setLobbyInfo(lobby);

        setTimeout(() => {
            startLobbyGame();
        }, 500);
    };

    useEffect(() => {
        socket?.emit(SOCKET_EVENTS.JOIN);

        socket?.on(SOCKET_EVENTS.LOBBY_DATA, receiveLobbyData);
        socket?.on(SOCKET_EVENTS.START_GAME, startGame);

        return () => {
            socket?.off(SOCKET_EVENTS.LOBBY_DATA, receiveLobbyData);
            socket?.off(SOCKET_EVENTS.START_GAME, startGame);
        };
    }, []);

    const onExit = () => {
        setGameState(GAME_STATES.GAME_MENU);

        socket?.emit(SOCKET_EVENTS.EXIT_ROOM);
    };

    return (
        <Wrapper className="w-full h-full flex justify-center items-center">
            <div className="relative w-[800px]">
                <img className="w-full" alt="pic" src={lobbyBackImg} />

                <ContentWrapper className="absolute top-0 left-0">
                    <div className="w-full h-full text-center border-separate border-spacing-y-[15px] flex flex-col gap-[5px]">
                        <div className="head text-[#ecea8c] text-[17.4px] flex">
                            <div className="w-[50%]">Player</div>
                            <div className="w-[25%]">Played</div>
                            <div className="w-[25%]">Win </div>
                        </div>
                        <div className="scroll">
                            {lobbyInfo?.players.map(
                                (player: any, index: number) => (
                                    <div
                                        style={{
                                            color: "white",
                                            borderRadius: "5px",
                                            borderWidth: "2px",
                                            borderColor:
                                                player.socketId === socket?.id
                                                    ? "#ffff00"
                                                    : "#2c322f",
                                        }}
                                        key={`player${index}`}
                                        className="text-[17.4px] bg-[#0007] flex p-1 my-2"
                                    >
                                        <div className="w-[50%] flex items-center gap-[20%]">
                                            <img
                                                width={40}
                                                src={playerAvatar}
                                            />
                                            <span>{`Player#${index + 1}`}</span>
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
