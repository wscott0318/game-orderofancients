import TWEEN from "@tweenjs/tween.js";

import AssetsManager from "./managers/AssetsManager";
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
import { UIBridge } from "../libs/UIBridge";

interface GameOptions {
    canvas: HTMLDivElement;
    assetsManager: AssetsManager;
    setCurrentGameState: Function;
    setUpgrades: Function;
    gameMode: number;
    lobbyInfo: LobbyInfo;
    playerIndex: number;
    uiBridge: UIBridge;
};

export class Game {

    public uiBridge: UIBridge;

    _sceneRenderer: SceneRenderer;
    _envRenderer: Environment;
    _assetsManager: AssetsManager;
    _towerManagerArray: TowerManager[];
    _botManagerArray: BotManager[];
    _spriteManager: SpriteManager;
    _particleEffect: ParticleEffect;
    _canvasDiv: HTMLDivElement;
    _stateManager: StateManager;
    _playerStateArray: PlayerState[];
    _timeManagerArray: TimeManager[];
    _lobbyInfo: LobbyInfo;
    _playerIndex: number;
    _gameMode: number;
    _animationManager: AnimationManager;

    //

    constructor(options: GameOptions) {

        this.uiBridge = options.uiBridge;
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

        for (let i = 0; i < this._lobbyInfo?.players.length; i++) {
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

        for (let i = 0; i < this._towerManagerArray.length; i++) {
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

        this._canvasDiv = options.canvas;
        this.initialize();

    }

    initialize() {

        this._animationManager.light_attention();
        this._canvasDiv.appendChild(this._sceneRenderer._renderer.domElement);
        this.animate();

    }

    dispose() {

        this._sceneRenderer.dispose();

    }

    animate = () => {

        if (this._stateManager.getCurrentState() === GAME_STATES.END) return;

        // process in/out events queue
        this.uiBridge.processEvents();

        requestAnimationFrame( this.animate );

        if (this._stateManager.getCurrentState() === GAME_STATES["PLAYING"]) {
            for (let i = 0; i < this._towerManagerArray.length; i++) {
                if (!this._towerManagerArray[i].isDead) {
                    this._towerManagerArray[i].tick();
                    this._botManagerArray[i].tick();
                    this._timeManagerArray[i].tick();
                } else {
                    if (this._botManagerArray[i].botArray.length > 0) {
                        for (
                            let j = 0;
                            j < this._botManagerArray[i].botArray.length;
                            j++
                        ) {
                            this._botManagerArray[i].botArray[j].kill();
                        }

                        this._botManagerArray[i].botArray = [];
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
