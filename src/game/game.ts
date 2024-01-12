import TWEEN from "@tweenjs/tween.js";

import { AssetsManager } from "./managers/AssetsManager";
import { BotManager } from "./managers/BotManager";
import { ParticleEffect } from "./ParticleEffect";
import { SpriteManager } from "./managers/SpriteManager";
import { TowerManager } from "./managers/TowerManager";
import { Environment } from "./rendering/Environment";
import { SceneRenderer } from "./rendering/SceneRenderer";
import { StateManager } from "./States/StateManager";
import { GAME_STATES } from "../constants";
import { PlayerState } from "./States/PlayerState";
import { TimeManager } from "./managers/TimeManager";
import { LobbyInfo } from "../contexts/game-context";
import { AnimationManager } from "./managers/AnimationManager";
import { uiBridge } from "../libs/UIBridge";

interface GameOptions {
    canvas: HTMLDivElement;
    assetsManager: AssetsManager;
    setCurrentGameState: Function;
    setUpgrades: Function;
    gameMode: number;
    lobbyInfo: LobbyInfo;
    playerIndex: number;
};

export class Game {

    private static _instance: Game;
    public static get instance () : Game {

        return Game._instance;

    };

    //

    public _sceneRenderer: SceneRenderer;
    public _envRenderer: Environment;
    public _assetsManager: AssetsManager;
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

    //

    constructor ( options: GameOptions ) {

        Game._instance = this;

        this._playerIndex = options.playerIndex;
        this._gameMode = options.gameMode;
        this._lobbyInfo = options.lobbyInfo;

        this._stateManager = new StateManager({
            setCurrentGameState: options.setCurrentGameState,
        });

        this._assetsManager = options.assetsManager;
        this._sceneRenderer = new SceneRenderer({
            playerIndex: this._playerIndex,
            lobbyInfo: this._lobbyInfo,
        });

        this._envRenderer = new Environment({
            sceneRenderer: this._sceneRenderer,
            models: this._assetsManager._models,
        });

        this._particleEffect = new ParticleEffect({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });

        this._spriteManager = new SpriteManager({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });

        this._animationManager = new AnimationManager({
            sceneRenderer: this._sceneRenderer,
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
                    sceneRenderer: this._sceneRenderer,
                    assetsManager: this._assetsManager,
                    stateManager: this._stateManager,
                    particleEffect: this._particleEffect,
                    playerIndex: this._playerIndex,
                    index: i,
                })
            );

        }

        for ( let i = 0; i < this._towerManagerArray.length; i ++ ) {

            this._botManagerArray.push(
                new BotManager({
                    sceneRenderer: this._sceneRenderer,
                    assetsManager: this._assetsManager,
                    index: i,
                })
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
                    sceneRenderer: this._sceneRenderer,
                    spriteManager: this._spriteManager,
                })
            );

        }

        this.initialize();

    }

    public initialize () : void {

        this._animationManager.light_attention();
        this._canvasDiv.appendChild( this._sceneRenderer._renderer.domElement );

    }

    public dispose () : void {

        this._sceneRenderer.dispose();

    }

    public animate = () : void => {

        if ( this._stateManager.getCurrentState() === GAME_STATES.END ) return;

        // process in/out events queue

        uiBridge.processEvents();

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

        this._sceneRenderer.render();
        TWEEN.update();

    }

}
