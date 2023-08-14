import AssetsManager from "./AssetsManager";
import { BotManager } from "./BotManager";
import { CollisionManager } from "./CollisionManager";
import { ParticleEffect } from "./ParticleEffect";
import SpriteManager from "./SpriteManager";
import { TowerManager } from "./TowerManager";
import { Environment } from "./rendering/Environment";
import { SceneRenderer } from "./rendering/SceneRenderer";
import TWEEN, { Easing } from "@tweenjs/tween.js";
import { StateManager } from "./States/StateManager";
import { GAME_STATES } from "../../constants";
import { AnimationManager } from "./AnimationManager";
import { PlayerState } from "./States/PlayerState";
import { TimeManager } from "./TimeManager";

interface GameOptions {
    canvas: HTMLDivElement;
    assetsManager: AssetsManager;
    setCurrentGameSate: Function;
    setUpgrades: Function;
}

export class Game {
    _sceneRenderer: SceneRenderer;
    _envRenderer: Environment;
    _assetsManager: AssetsManager;
    _towerManager: TowerManager;
    _botManager: BotManager;
    _spriteManager: SpriteManager;
    _collisionManager: CollisionManager;
    _particleEffect: ParticleEffect;
    _canvasDiv: HTMLDivElement;
    _stateManager: StateManager;
    _animationsManager: AnimationManager;
    _playerState: PlayerState;
    _timeManager: TimeManager;

    constructor(options: GameOptions) {
        this._playerState = new PlayerState();

        this._stateManager = new StateManager({
            setCurrentGameSate: options.setCurrentGameSate,
        });

        this._assetsManager = options.assetsManager;
        this._sceneRenderer = new SceneRenderer();
        this._envRenderer = new Environment({
            sceneRenderer: this._sceneRenderer,
            models: this._assetsManager._models,
        });
        this._particleEffect = new ParticleEffect({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });
        this._towerManager = new TowerManager({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
            stateManager: this._stateManager,
            particleEffect: this._particleEffect,
        });
        this._botManager = new BotManager({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });
        this._spriteManager = new SpriteManager();
        this._collisionManager = new CollisionManager({
            sceneRenderer: this._sceneRenderer,
            towerManager: this._towerManager,
            botManager: this._botManager,
            spriteManager: this._spriteManager,
            particleEffect: this._particleEffect,
            playerState: this._playerState,
            assetsManager: this._assetsManager,
        });
        this._animationsManager = new AnimationManager({
            sceneRenderer: this._sceneRenderer,
        });

        this._timeManager = new TimeManager({
            playerState: this._playerState,
            towerManager: this._towerManager,
            sceneRenderer: this._sceneRenderer,
            spriteManager: this._spriteManager,
            setUpgrades: options.setUpgrades,
        });

        this._canvasDiv = options.canvas;
        this.initialize();
    }

    initialize() {
        this._canvasDiv.appendChild(this._sceneRenderer._renderer.domElement);
        this.animate();
    }

    dispose() {
        this._sceneRenderer.dispose();
    }

    animate() {
        if (this._stateManager.getCurrentState() === GAME_STATES.END) return;

        requestAnimationFrame(this.animate.bind(this));

        if (this._stateManager.getCurrentState() === GAME_STATES["PLAYING"]) {
            this._towerManager.tick();

            this._botManager.tick();

            this._spriteManager.tick();

            this._particleEffect.tick();

            this._collisionManager.tick();

            this._timeManager.tick();
        }

        this._sceneRenderer.render();

        TWEEN.update();
    }
}
