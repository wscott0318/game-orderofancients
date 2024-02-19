
import io, { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import {
    BotStatus,
    NewSpriteInfo,
    NewTextSpriteInfo,
    SpriteStatus,
    TimerStatus,
    TowerStatus,
} from "../../constants/type";
import { SOCKET_EVENTS } from "../../constants/socket";
import { LobbyInfo, PlayerInfo } from "../../contexts/game-context";
import { getColorForPercentage } from "../../helper/color";
import { Config } from "../../utils/config";
import { EventBridge } from "../../libs/EventBridge";
import { Events } from "../../constants/GameEvents";
import { Game } from "..";

//

export class NetworkHandler {

    public socket: Socket | null = null;

    //

    public initialize () : void {

        this.socket = io( Config.socketServerUrl );

        this.socket.on( "connect_error", ( error ) => {

            toast.error(
                `Can't connect to server. Please check server status.`
            );

        });

        this.socket.on( "connect", () => {

            const socket = this.socket;
            console.log( "Connected to server" );

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

    }

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

    private onStartGame = ( lobby: LobbyInfo ) : void => {

        console.log( 'game started' );

        EventBridge.dispatchToUI( Events.Game.SET_LOBBY_DATA, lobby );

        const player = lobby.players.find(
            ( item ) => item.socketId === this.socket?.id
        );

        EventBridge.dispatchToUI( Events.Game.SET_PLAYER_UPGRADES, player?.upgrades );

        setTimeout( () => {

            EventBridge.dispatchToUI( Events.Game.GAME_START );

        }, 300 );

    }

    public onReceiveLobbyData = ( lobby: LobbyInfo ) : void => {

        EventBridge.dispatchToUI( Events.Game.SET_LOBBY_DATA, lobby );

    }

    public onReceiveTowerStatus = ( towerStatusData: TowerStatus[], timerStatus: TimerStatus ) : void => {

        const game = Game.instance;

        const playerIndex = game._lobbyInfo.players.findIndex(
            ( player ) => player.socketId === this.socket?.id
        );

        towerStatusData.forEach( ( towerStatus, index ) => {

            const towerManager = game._towerManagerArray[ index ] as any;
            towerManager.level = towerStatus.level;
            towerManager.maxHp = towerStatus.maxHp;
            towerManager.hp = towerStatus.hp;
            towerManager.isDead = towerStatus.isDead;

            const healthBarDiv = document.getElementsByClassName( "status_player_health" )[index] as HTMLDivElement;

            if ( healthBarDiv ) {

                healthBarDiv.style.width = `${ ( towerManager.hp / towerManager.maxHp ) * 100 }%`;
                healthBarDiv.style.backgroundColor = `${ getColorForPercentage( towerManager.hp / towerManager.maxHp ) }`;

            }

            if ( towerStatus.isDead && index === playerIndex ) {

                // todo

            }

            ( game._playerStateArray[ index ] as any ).gold = towerStatus.gold;

        });

        game._timeManagerArray.forEach( ( timeManager ) => {

            timeManager.secondTracker = timerStatus.secondTracker;
            timeManager.roundTracker = timerStatus.roundTracker;
            timeManager.totalTimeTracker = timerStatus.totalTimeTracker;

        });

    }

    public onReceiveProduceBot = (playerIndex: number, newBot: any) : void => {

        Game.instance._botManagerArray[ playerIndex ].addNewBot( newBot );

    };

    public onReceiveBotStatus = ( botStatusData: BotStatus[][])  : void => {

        const game = Game.instance;

        if ( game._botManagerArray[0].botArray.length !== botStatusData[0].length ) {

            console.error("unsynce bot data");

        }

        for ( let i = 0; i < botStatusData.length; i ++ ) {

            for ( let j = 0; j < botStatusData[ i ].length; j ++ ) {

                const bot = game._botManagerArray[ i ].botArray[ j ] as any;
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

    }

    public onReceiveUpgrades = ( playersInfo: PlayerInfo[] ) : void => {

        const player = playersInfo.find( ( el ) => el.socketId === this.socket?.id );
        EventBridge.dispatchToUI( Events.Game.SET_PLAYER_UPGRADES, player?.upgrades );

    }

    public onTickSecond = ( playerIndex: number, value: number ) : void => {

        Game.instance._timeManagerArray[ playerIndex ].tickSecond( value );

    }

    public onTickRound = ( playerIndex: number ) : void => {

        Game.instance._timeManagerArray[ playerIndex ].tickRound();

    }

    public onAddSprite = ( newSpriteInfo: NewSpriteInfo ) : void => {

        Game.instance._spriteManager.addSpriteFrom( newSpriteInfo );

    }

    public onAddTextSprite = ( newTextSpriteInfo: NewTextSpriteInfo ) : void => {

        Game.instance._spriteManager.addTextSpriteFrom( newTextSpriteInfo );

    };

    public onAddSpriteCollisionEffect = ( spriteIndex: number ) : void => {

        Game.instance._spriteManager.spriteArray[ spriteIndex ].addCollisionEffect();

    }

    public onDisposeSprite = (removeSpriteArray: number[]) : void => {

        const game = Game.instance;
        const spriteArray = game._spriteManager.spriteArray;
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

        ( game._spriteManager as any ).spriteArray = newArray;

    }

    public onReceiveSpriteStatus = ( spriteStatusData: SpriteStatus[] ) : void => {

        const game = Game.instance;
        const spriteArray = game._spriteManager.spriteArray;

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

    }

    public onKillBot = ( playerIndex: number, botIndex: number ) : void => {

        Game.instance._botManagerArray[ playerIndex ].botArray[ botIndex ].kill();

    }

    public onRemoveDeadBots = ( playerIndex: number, deadBotArray: number[] ) : void => {

        const game = Game.instance;
        if ( ! game._botManagerArray[ playerIndex ].botArray ) return;

        const newArray = [];
        const botArray = game._botManagerArray[playerIndex].botArray;

        for ( let i = 0; i < botArray.length; i ++ ) {

            const index = deadBotArray.findIndex(
                ( deadIndex: number ) => deadIndex === i
            );

            if ( index === -1 ) {

                newArray.push( botArray[ i ] );

            }

        }

        ( game._botManagerArray[ playerIndex ] as any ).botArray = newArray;

    }

}

export const Network = new NetworkHandler();
