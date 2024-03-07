
import TWEEN from "@tweenjs/tween.js";

import { ParticleEffect } from "./gfx/managers/ParticleEffect";
import { SpriteManager } from "./gfx/managers/SpriteManager";
import { TowerManager } from "./managers/TowerManager";
import { StateManager } from "./states/StateManager";
import { GAME_STATES } from "../../constants";
import { AnimationManager } from "./gfx/managers/AnimationManager";
import { GameScene, Gfx } from "./gfx";
import { LobbyInfo } from "../Types";
import EventEmitter from "events";
import { GameEvents } from "../Events";
import { ResourcesManager } from "./managers/ResourcesManager";
import { Network } from "./networking/Network";
import { SOCKET_EVENTS } from "../../constants/socket";
import { ArenaScene } from "./gfx/arena-scenes/ArenaScene";
import { TowerEntity } from "./entities/Tower.Entity";

//

export class GameWorkerCore extends EventEmitter {

    public towerManager: TowerManager;
    public spriteManager: SpriteManager;
    public particleEffect: ParticleEffect;
    public canvasDiv: HTMLDivElement;
    public lobbyInfo: LobbyInfo;
    public playerIndex: number;
    public gameMode: number;
    public animationManager: AnimationManager;

    public gameScene: GameScene;

    public inited: boolean = false;

    //

    constructor () {

        super();

        // @eslint-disable-next-line
        self.onmessage = this.onMessage;

        //

        this.addListener( GameEvents.INIT_NETWORK, () => {

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

    };

    public init () : void {

        let playerIndex = 0;
        playerIndex = this.lobbyInfo.players.findIndex(
            (player) => player.socketId === Network.socket?.id
        );

        this.playerIndex = playerIndex;

        this.gameScene = new ArenaScene();
        this.gameScene.init();

        Gfx.setActiveScene( this.gameScene );

        this.particleEffect = new ParticleEffect({
            gameScene: this.gameScene
        });

        this.spriteManager = new SpriteManager({
            gameScene: this.gameScene
        });

        this.animationManager = new AnimationManager({
            gameScene: this.gameScene,
            playerIndex: this.playerIndex
        });

        this.towerManager = new TowerManager();

        for ( let i = 0; i < this.lobbyInfo.players.length; i ++ ) {

            const tower = new TowerEntity({
                particleEffect:     this.particleEffect,
                playerIndex:        this.playerIndex,
                index:              i
            });

            this.towerManager.add( tower );

        }

        //

        this.addListener( "upgradeSpell", this.towerSpellUpgrade );
        // EventBridge.onUIEvent( "Dispose", this.dispose );

        this.inited = true;

    };

    public dispose = () : void => {

        this.towerManager.dispose();

        Gfx.dispose();

        // this.stateManager.dispose();
        // this.stateManager.dispose();
        // this.particleEffect.dispose();
        // this.spriteManager.dispose();

    };

    private towerSpellUpgrade = ( data: any ) : void => {

        Network.socket?.emit( SOCKET_EVENTS.UPGRADE_SPELL, data.item, data.itemIndex );

    };

    public animate = () : void => {

        requestAnimationFrame( this.animate );

        TWEEN.update();

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

        this.setLobbyInfo( lobby );
        this.sendToMain( GameEvents.START_GAME );

    };

    //

    private onMessage = ( event: MessageEvent ) : void => {

        this.emit( event.data.eventName, event.data.params );

    };

};

export const GameWorker = new GameWorkerCore();
