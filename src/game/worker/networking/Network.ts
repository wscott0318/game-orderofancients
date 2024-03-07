
import io, { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import {
    BotStatus,
    NewSpriteInfo,
    NewTextSpriteInfo,
    SpriteStatus,
    TimerStatus
} from "../../../constants/type";
import { SOCKET_EVENTS } from "../../../constants/socket";
import { Config } from "../../../utils/config";
import { ITowerStatus } from "../entities/Tower.Entity";
import { LobbyInfo, PlayerInfo } from "../../Types";
import { GameWorker } from "../GameWorker";
import { GameEvents } from "../../Events";

//

export class NetworkHandler {

    public socket: Socket | null = null;

    //

    public init () : void {

        this.socket = io( Config.socketServerUrl, { transports: [ 'websocket' ] } );

        this.socket.on( "connect_error", ( error ) => {

            // toast.error(
            //     `Can't connect to server. Please check server status.`
            // );
            console.log('error', error);

        });

        this.socket.on( "connect", () => {

            const socket = this.socket;

            if ( ! socket ) {

                console.error( "Socket is null" );
                return;

            }

            console.log( "Connected to server" );

            GameWorker.sendToMain( GameEvents.NETWORK_INITED, { socketId: socket.id } );

            // Game start
            socket?.on( SOCKET_EVENTS.START_GAME, this.onStartGame );

            // Game events
            socket?.on( SOCKET_EVENTS.TOWER_STATUS, this.onReceiveTowerStatus );
            socket?.on( SOCKET_EVENTS.PRODUCE_BOT, this.onReceiveProduceBot );
            socket?.on( SOCKET_EVENTS.BOT_STATUS, this.onReceiveBotStatus );
            socket?.on( SOCKET_EVENTS.RECEIVE_UPGRADES, this.onReceiveUpgrades );
            socket?.on( SOCKET_EVENTS.TICK_SECOND, this.onTickSecond );
            socket?.on( SOCKET_EVENTS.TICK_ROUND, this.onTickRound );
            socket?.on( SOCKET_EVENTS.ADD_SPRITE, this.onAddSprite );
            socket?.on( SOCKET_EVENTS.ADD_TEXT_SPRITE, this.onAddTextSprite );
            socket?.on( SOCKET_EVENTS.ADD_SPRITE_COLLISION_EFFECT, this.onAddSpriteCollisionEffect );
            socket?.on( SOCKET_EVENTS.ADD_TEXT_SPRITE, this.onAddTextSprite );
            socket?.on( SOCKET_EVENTS.DISPOSE_SPRITE, this.onDisposeSprite );
            socket?.on( SOCKET_EVENTS.SPRITE_STATUS, this.onReceiveSpriteStatus );
            socket?.on( SOCKET_EVENTS.KILL_BOT, this.onKillBot );
            socket?.on( SOCKET_EVENTS.REMOVE_DEAD_BOTS, this.onRemoveDeadBots );

            // Looby events
            socket?.on( SOCKET_EVENTS.LOBBY_DATA, this.onReceiveLobbyData );

        });

    };

    public dispose () : void {

        const socket = this.socket;

        socket?.off( SOCKET_EVENTS.START_GAME, this.onStartGame );
        socket?.off( SOCKET_EVENTS.TOWER_STATUS, this.onReceiveTowerStatus );
        socket?.off( SOCKET_EVENTS.PRODUCE_BOT, this.onReceiveProduceBot );
        socket?.off( SOCKET_EVENTS.BOT_STATUS, this.onReceiveBotStatus );
        socket?.off( SOCKET_EVENTS.RECEIVE_UPGRADES, this.onReceiveUpgrades );
        socket?.off( SOCKET_EVENTS.LOBBY_DATA, this.onReceiveLobbyData );
        socket?.off( SOCKET_EVENTS.TICK_SECOND, this.onTickSecond );
        socket?.off( SOCKET_EVENTS.TICK_ROUND, this.onTickRound );
        socket?.off( SOCKET_EVENTS.ADD_SPRITE_COLLISION_EFFECT, this.onAddSpriteCollisionEffect );
        socket?.off( SOCKET_EVENTS.ADD_TEXT_SPRITE, this.onAddTextSprite );
        socket?.off( SOCKET_EVENTS.DISPOSE_SPRITE, this.onDisposeSprite );
        socket?.off( SOCKET_EVENTS.SPRITE_STATUS, this.onReceiveSpriteStatus );
        socket?.off( SOCKET_EVENTS.KILL_BOT, this.onKillBot );

    };

    //

    private onStartGame = ( lobbyInfo: LobbyInfo ) : void => {

        GameWorker.startGame( lobbyInfo );

        const player = GameWorker.lobbyInfo.players.find(
            ( item ) => item.socketId === this.socket?.id
        );

        GameWorker.sendToMain( GameEvents.SET_PLAYER_UPGRADES, player?.upgrades );

    };

    public onReceiveLobbyData = ( lobbyInfo: LobbyInfo ) : void => {

        GameWorker.setLobbyInfo( lobbyInfo );

    };

    public onReceiveTowerStatus = ( towerStatusData: ITowerStatus[], timerStatus: TimerStatus ) : void => {

        towerStatusData.forEach( ( towerStatus, index ) => {

            const tower = GameWorker.towerManager.get( index );
            tower.setStatus( towerStatus );

        });

        GameWorker.towerManager.towersArray.forEach( ( tower ) => {

            tower.time.secondTracker = timerStatus.secondTracker;
            tower.time.roundTracker = timerStatus.roundTracker;
            tower.time.totalTimeTracker = timerStatus.totalTimeTracker;

        });

    };

    public onReceiveProduceBot = ( playerIndex: number, newBot: { botType: number } ) : void => {

        GameWorker.towerManager.get( playerIndex ).botManager.add( newBot.botType );

    };

    public onReceiveBotStatus = ( botStatusData: BotStatus[][] ) : void => {

        if ( GameWorker.towerManager.get( 0 ).botManager.bots.length !== botStatusData[0].length ) {

            console.error("unsynce bot data");

        }

        for ( let i = 0; i < botStatusData.length; i ++ ) {

            for ( let j = 0; j < botStatusData[ i ].length; j ++ ) {

                const bot = GameWorker.towerManager.get( i ).botManager.bots[ j ] as any;
                const botStatus = botStatusData[ i ][ j ];
                if ( ! botStatus ) continue;

                bot.hp = botStatus.hp;
                bot.position = botStatus.position;
                bot.status = botStatus.status;
                bot.oldStatus = botStatus.oldStatus;
                bot.claimTime = botStatus.claimTime;
                bot.canRemove = botStatus.canRemove;
                bot.stunTime = botStatus.stunTime;
                bot.slowTime = botStatus.slowTime;
                bot.fireTime = botStatus.fireTime;

            }

        }

    };

    public onReceiveUpgrades = ( playersInfo: PlayerInfo[] ) : void => {

        const player = playersInfo.find( ( el ) => el.socketId === this.socket?.id );
        GameWorker.sendToMain( GameEvents.SET_PLAYER_UPGRADES, player?.upgrades );

    };

    public onTickSecond = ( playerIndex: number, value: number ) : void => {

        GameWorker.towerManager.get( playerIndex ).time.tickSecond( value );

    };

    public onTickRound = ( playerIndex: number ) : void => {

        GameWorker.towerManager.get( playerIndex ).time.tickRound();

    };

    public onAddSprite = ( newSpriteInfo: NewSpriteInfo ) : void => {

        GameWorker.spriteManager.addSpriteFrom( newSpriteInfo );

    };

    public onAddTextSprite = ( newTextSpriteInfo: NewTextSpriteInfo ) : void => {

        GameWorker.spriteManager.addTextSpriteFrom( newTextSpriteInfo );

    };

    public onAddSpriteCollisionEffect = ( spriteIndex: number ) : void => {

        GameWorker.spriteManager.spriteArray[ spriteIndex ].addCollisionEffect();

    };

    public onDisposeSprite = ( removeSpriteArray: number[] ) : void => {

        const spriteArray = GameWorker.spriteManager.spriteArray;
        const newArray = [];

        for ( let i = 0; i < spriteArray.length; i ++ ) {

            const index = removeSpriteArray.findIndex(
                ( removeIndex: number ) => removeIndex === i
            );

            if ( index === -1 ) {

                newArray.push( spriteArray[ i ] );

            } else {

                spriteArray[ i ].dispose();

            }

        }

        GameWorker.spriteManager.spriteArray = newArray;

    };

    public onReceiveSpriteStatus = ( spriteStatusData: SpriteStatus[] ) : void => {

        const spriteArray = GameWorker.spriteManager.spriteArray;

        if ( spriteArray.length !== spriteStatusData.length ) {

            console.error("sprite sync error");

        }

        for ( let i = 0; i < spriteStatusData.length; i ++ ) {

            spriteArray[ i ].targetPos.x = spriteStatusData[ i ].targetPos.x;
            spriteArray[ i ].targetPos.y = spriteStatusData[ i ].targetPos.y;
            spriteArray[ i ].targetPos.z = spriteStatusData[ i ].targetPos.z;

            if ( spriteArray[ i ].bounceCount ) {

                spriteArray[ i ].bounceCount = spriteStatusData[ i ].bounceCount;

            }

            spriteArray[ i ].mesh.position.set(
                spriteStatusData[ i ].position.x,
                spriteStatusData[ i ].position.y,
                spriteStatusData[ i ].position.z
            );

        }

    };

    public onKillBot = ( playerIndex: number, botIndex: number ) : void => {

        GameWorker.towerManager.get( playerIndex ).botManager.bots[ botIndex ].kill();

    };

    public onRemoveDeadBots = ( playerIndex: number, deadBotArray: number[] ) : void => {

        const botArray = GameWorker.towerManager.get( playerIndex ).botManager.bots;

        if ( ! botArray.length ) return;

        const newArray = [];

        for ( let i = 0; i < botArray.length; i ++ ) {

            const index = deadBotArray.findIndex(
                ( deadIndex: number ) => deadIndex === i
            );

            if ( index === -1 ) {

                newArray.push( botArray[ i ] );

            }

        }

        GameWorker.towerManager.get( playerIndex ).botManager.bots = newArray;

    };

};

export const Network = new NetworkHandler();
