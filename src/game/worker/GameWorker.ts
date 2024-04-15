
import EventEmitter from "events";

import { Gfx } from "./gfx";
import { LobbyInfo } from "../Types";
import { GameEvents } from "../Events";
import { ResourcesManager } from "./managers/ResourcesManager";
import { Network } from "./networking/Network";
import { SOCKET_EVENTS } from "../../constants/socket";
import { ArenaScene } from "./gfx/arena-scenes/ArenaScene";
import { GAME_STATES } from "../../constants";

//

export class GameWorkerCore extends EventEmitter {

    public lobbyInfo: LobbyInfo;
    public playerIndex: number;
    public gameMode: number;

    public arenaScene: ArenaScene;

    public inited: boolean = false;
    public finished: boolean = false;

    private prevUpdateTime: number = 0;
    public tick: number = 0;

    public config: any;

    //

    constructor () {

        super();

        // @eslint-disable-next-line
        self.onmessage = this.onMessage;

        //

        this.addListener( GameEvents.INIT_NETWORK, ( params: any ) => {

            console.log( 'GameWorkerCore: INIT_CONFIG', params.config );

            this.config = params.config;
            Network.init();

        });

        this.addListener( GameEvents.LOAD_ASSETS, () => {

            ResourcesManager.load( ( progress ) => {

                this.sendToMain( GameEvents.ASSETS_LOADING_PROGRESS_UPDATE, progress );

            }, () => {

                this.sendToMain( GameEvents.ASSETS_LOADING_FINISHED );

            });

        });

        this.addListener( GameEvents.INIT_GFX, ( props: any ) => {

            Gfx.init( props );
            this.init();

        });

        this.addListener( GameEvents.LOAD_ASSETS, () => {

            console.log( 'GameWorkerCore: LOAD_ASSETS' );

        });

        //

        this.addListener( GameEvents.LOBBY_JOIN, () => {

            Network.socket?.emit( SOCKET_EVENTS.JOIN );

        });

        this.addListener( GameEvents.PLAY_SINGLE, () => {

            Network.socket?.emit( SOCKET_EVENTS.PLAY_SINGLE );

        });

        this.addListener( GameEvents.LOBBY_EXIT_ROOM, () => {

            Network.socket?.emit( SOCKET_EVENTS.EXIT_ROOM );

        });

        this.addListener( GameEvents.DISPOSE, () => {

            this.dispose();

        });

        this.addListener( "upgradeSpell", this.towerSpellUpgrade );

        this.sendToMain( GameEvents.WORKER_INITED );

    };

    public init () : void {

        let playerIndex = 0;
        playerIndex = this.lobbyInfo.players.findIndex(
            (player) => player.socketId === Network.socket?.id
        );

        this.playerIndex = playerIndex;

        this.arenaScene = new ArenaScene();
        this.arenaScene.init();

        Gfx.setActiveScene( this.arenaScene );

        this.inited = true;
        this.update();

    };

    public dispose = () : void => {

        this.inited = false;
        this.arenaScene.dispose();
        Gfx.dispose();
        Network.dispose();

    };

    private towerSpellUpgrade = ( data: any ) : void => {

        Network.socket?.emit( SOCKET_EVENTS.UPGRADE_SPELL, data.item, data.itemIndex );

    };

    public sendToMain = ( eventName: string, params?: any, buffers: Transferable[] = [] ) : void => {

        // @eslint-disable-next-line
        // @ts-ignore
        self.postMessage({ eventName, params }, buffers );

    };

    public setLobbyInfo = ( lobbyInfo: LobbyInfo ) : void => {

        this.lobbyInfo = lobbyInfo;
        this.sendToMain( GameEvents.SET_LOBBY_DATA, lobbyInfo );

    };

    public startGame = ( lobby: LobbyInfo ) : void => {

        this.finished = false;
        this.setLobbyInfo( lobby );
        this.sendToMain( GameEvents.START_GAME );

    };

    public gameOver = () : void => {

        this.finished = true;

        if ( this.arenaScene.towerManager.get( this.playerIndex ).time.totalTimeTracker > 90 ) {

            this.sendToMain( GameEvents.SET_STATE, GAME_STATES.WON );

        } else {

            this.sendToMain( GameEvents.SET_STATE, GAME_STATES.LOST );

        }

    };

    //

    private update = () : void => {

        this.tick ++;

        //

        const time = performance.now();
        const delta = ( this.prevUpdateTime ? time - this.prevUpdateTime : 0 ) / 1000;
        this.prevUpdateTime = time;

        if ( this.inited ) {

            this.arenaScene.update( delta, time );
            Gfx.update( delta, time );

        }

        requestAnimationFrame( this.update );

    };

    private onMessage = ( event: MessageEvent ) : void => {

        this.emit( event.data.eventName, event.data.params );

    };

};

export const GameWorker = new GameWorkerCore();
