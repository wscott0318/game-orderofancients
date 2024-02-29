
import TWEEN from "@tweenjs/tween.js";

import { ParticleEffect } from "./gfx/managers/ParticleEffect";
import { SpriteManager } from "./gfx/managers/SpriteManager";
import { TowerManager } from "./managers/TowerManager";
import { StateManager } from "./states/StateManager";
import { GAME_STATES } from "../../constants";
import { AnimationManager } from "./gfx/managers/AnimationManager";
import { EventBridge } from "../../libs/EventBridge";
import { GameScene, Gfx } from "./gfx";
import { ArenaScene } from "./gfx/arena-scenes/ArenaScene";
import { SOCKET_EVENTS } from "../../constants/socket";
import { TowerEntity } from "./entities/Tower.Entity";
import { LobbyInfo } from "../Types";
import EventEmitter from "events";
import { GameEvents } from "../Events";
import { ResourcesManager } from "./managers/ResourcesManager";
// import { Network } from "./networking/Network";

//

interface GameOptions {
    canvas:                 HTMLDivElement;
    setCurrentGameState:    Function;
    gameMode:               number;
    lobbyInfo:              LobbyInfo;
    playerIndex:            number;
};

//

export class GameWorkerCore extends EventEmitter {

    public towerManager: TowerManager;
    public _spriteManager: SpriteManager;
    public _particleEffect: ParticleEffect;
    public _canvasDiv: HTMLDivElement;
    public _stateManager: StateManager;
    public _lobbyInfo: LobbyInfo;
    public _playerIndex: number;
    public _gameMode: number;
    public _animationManager: AnimationManager;

    public gameScene: GameScene;

    //

    constructor () {

        super();

        // @eslint-disable-next-line
        self.onmessage = this.onMessage;

        //

        this.addListener( GameEvents.INIT_NETWORK, () => {

            ResourcesManager.load( ( progress ) => {

                console.log( 'Loading progress:', progress );
                this.sendToMain( GameEvents.ASSETS_LOADING_PROGRESS_UPDATE, progress );

            }, () => {

                this.sendToMain( GameEvents.ASSETS_LOADING_FINISHED );

            });

        });

        this.addListener( GameEvents.LOAD_ASSETS, () => {

            console.log( 'GameWorkerCore: LOAD_ASSETS' );

        });

    };

    public init ( params: GameOptions ) : void {

        // this._playerIndex = options.playerIndex;
        // this._gameMode = options.gameMode;
        // this._lobbyInfo = options.lobbyInfo;

        // this.gameScene = new ArenaScene();
        // this.gameScene.init();

        // Gfx.setActiveScene( this.gameScene );

        // this._stateManager = new StateManager({
        //     setCurrentGameState: options.setCurrentGameState,
        // });

        // this._particleEffect = new ParticleEffect({
        //     gameScene: this.gameScene
        // });

        // this._spriteManager = new SpriteManager({
        //     gameScene: this.gameScene
        // });

        // this._animationManager = new AnimationManager({
        //     gameScene: this.gameScene,
        //     playerIndex: this._playerIndex,
        // });

        // this.towerManager = new TowerManager();

        // this._canvasDiv = options.canvas;

        // for ( let i = 0; i < this._lobbyInfo?.players.length; i ++ ) {

        //     const tower = new TowerEntity({
        //         stateManager:       this._stateManager,
        //         particleEffect:     this._particleEffect,
        //         playerIndex:        this._playerIndex,
        //         index:              i
        //     });

        //     this.towerManager.add( tower );

        // }

        // //

        // EventBridge.onUIEvent( "upgradeSpell", this.towerSpellUpgrade );
        // EventBridge.onUIEvent( "Dispose", this.dispose );

        // this.initialize();

    };

    public initialize () : void {

        // this._animationManager.light_attention();

    };

    public dispose = () : void => {

        this.towerManager.dispose();

        Gfx.dispose();

        // this._stateManager.dispose();
        // this._stateManager.dispose();
        // this._particleEffect.dispose();
        // this._spriteManager.dispose();

    };

    private towerSpellUpgrade = ( data: any ) : void => {

        // Network.socket?.emit( SOCKET_EVENTS.UPGRADE_SPELL, data.item, data.itemIndex );

    };

    public animate = () : void => {

        if ( this._stateManager.getCurrentState() === GAME_STATES.END ) return;

        // process in/out events queue

        // EventBridge.processEvents();

        requestAnimationFrame( this.animate );

        if ( this._stateManager.getCurrentState() === GAME_STATES["PLAYING"] ) {

            this.towerManager.update();
            this._spriteManager.tick();
            this._particleEffect.tick();

        }

        TWEEN.update();

    };

    public sendToMain = ( eventName: string, params?: any, buffers: Transferable[] = [] ) : void => {

        // @eslint-disable-next-line
        // @ts-ignore
        self.postMessage({ eventName, params }, buffers );

    };

    //

    private onMessage = ( event: MessageEvent ) : void => {

        this.emit( event.data.eventName, event.data.params );

    };

};

export const GameWorker = new GameWorkerCore();
