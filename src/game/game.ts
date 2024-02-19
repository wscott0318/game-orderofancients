
import TWEEN from "@tweenjs/tween.js";

import { BotManager } from "./managers/BotManager";
import { ParticleEffect } from "./gfx/managers/ParticleEffect";
import { SpriteManager } from "./gfx/managers/SpriteManager";
import { TowerManager } from "./managers/TowerManager";
import { StateManager } from "./States/StateManager";
import { GAME_STATES } from "../constants";
import { PlayerState } from "./States/PlayerState";
import { TimeManager } from "./managers/TimeManager";
import { LobbyInfo } from "../contexts/game-context";
import { AnimationManager } from "./gfx/managers/AnimationManager";
import { EventBridge } from "../libs/EventBridge";
import { GameScene, Gfx } from "./gfx";
import { ArenaScene } from "./gfx/arena-scenes/ArenaScene";
import { Network } from "./networking/NetworkHandler";
import { SOCKET_EVENTS } from "../constants/socket";

interface GameOptions {
    canvas: HTMLDivElement;
    setCurrentGameState: Function;
    setUpgrades: Function;
    gameMode: number;
    lobbyInfo: LobbyInfo;
    playerIndex: number;
};

//

export class Game {

    private static _instance: Game;
    public static get instance () : Game {

        return Game._instance;

    };

    //

    public _towerManagerArray: TowerManager[];
    public _botManagerArray: BotManager[];
    public _spriteManager: SpriteManager;
    public _particleEffect: ParticleEffect;
    public _canvasDiv: HTMLDivElement;
    public _stateManager: StateManager;
    public _playerStateArray: PlayerState[];
    public _timeManagerArray: TimeManager[];
    public _lobbyInfo: LobbyInfo;
    public _playerIndex: number;
    public _gameMode: number;
    public _animationManager: AnimationManager;

    public gameScene: GameScene;

    //

    constructor ( options: GameOptions ) {

        Game._instance = this;

        this._playerIndex = options.playerIndex;
        this._gameMode = options.gameMode;
        this._lobbyInfo = options.lobbyInfo;

        this.gameScene = new ArenaScene();
        this.gameScene.init();

        Gfx.setActiveScene( this.gameScene );

        this._stateManager = new StateManager({
            setCurrentGameState: options.setCurrentGameState,
        });

        this._particleEffect = new ParticleEffect({
            gameScene: this.gameScene
        });

        this._spriteManager = new SpriteManager({
            gameScene: this.gameScene
        });

        this._animationManager = new AnimationManager({
            gameScene: this.gameScene,
            playerIndex: this._playerIndex,
        });

        this._towerManagerArray = [];
        this._botManagerArray = [];
        this._playerStateArray = [];
        this._timeManagerArray = [];
        this._canvasDiv = options.canvas;

        for ( let i = 0; i < this._lobbyInfo?.players.length; i ++ ) {

            this._towerManagerArray.push(
                new TowerManager({
                    stateManager: this._stateManager,
                    particleEffect: this._particleEffect,
                    playerIndex: this._playerIndex,
                    index: i,
                })
            );

        }

        for ( let i = 0; i < this._towerManagerArray.length; i ++ ) {

            this._botManagerArray.push(
                new BotManager({ index: i })
            );

            this._playerStateArray.push(
                new PlayerState({
                    index: i,
                    playerIndex: this._playerIndex,
                })
            );

            this._timeManagerArray.push(
                new TimeManager({
                    playerState: this._playerStateArray[i],
                    towerManager: this._towerManagerArray[i],
                    spriteManager: this._spriteManager,
                })
            );

        }

        EventBridge.onUIEvent( "upgradeSpell", this.towerSpellUpgrade );
        EventBridge.onUIEvent( "Dispose", this.dispose );

        this.initialize();

    }

    public initialize () : void {

        // this._animationManager.light_attention();

    }

    public dispose = () : void => {

        Gfx.dispose();

        this._towerManagerArray = [];
        this._botManagerArray = [];
        this._playerStateArray = [];
        this._timeManagerArray = [];

        // this._stateManager.dispose();
        // this._stateManager.dispose();
        // this._particleEffect.dispose();
        // this._spriteManager.dispose();

    }

    private towerSpellUpgrade = ( data: any ) : void => {

        Network.socket?.emit( SOCKET_EVENTS.UPGRADE_SPELL, data.item, data.itemIndex );

    };

    public animate = () : void => {

        if ( this._stateManager.getCurrentState() === GAME_STATES.END ) return;

        // process in/out events queue

        EventBridge.processEvents();

        requestAnimationFrame( this.animate );

        if ( this._stateManager.getCurrentState() === GAME_STATES["PLAYING"] ) {

            for ( let i = 0; i < this._towerManagerArray.length; i ++ ) {

                if ( ! this._towerManagerArray[ i ].isDead ) {

                    this._towerManagerArray[ i ].tick();
                    this._botManagerArray[ i ].tick();
                    this._timeManagerArray[ i ].tick();

                } else {

                    if ( this._botManagerArray[ i ].botArray.length > 0 )  {

                        for ( let j = 0; j < this._botManagerArray[ i ].botArray.length; j ++ ) {

                            this._botManagerArray[ i ].botArray[ j ].kill();

                        }

                        this._botManagerArray[ i ].botArray = [];

                    }

                }

            }

            this._spriteManager.tick();
            this._particleEffect.tick();

        }

        TWEEN.update();

    }

}
