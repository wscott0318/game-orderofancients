import AssetsManager from "./AssetsManager";
import { BotManager } from "./BotManager";
import { CollisionManager } from "./CollisionManager";
import { ParticleEffect } from "./ParticleEffect";
import SpriteManager from "./SpriteManager";
import { TowerManager } from "./TowerManager";
import { Environment } from "./rendering/Environment";
import { SceneRenderer } from "./rendering/SceneRenderer";
import TWEEN from "@tweenjs/tween.js";

interface GameOptions {
    canvas: HTMLDivElement;
    assetsManager: AssetsManager;
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

    constructor(options: GameOptions) {
        this._assetsManager = options.assetsManager;
        this._sceneRenderer = new SceneRenderer();
        this._envRenderer = new Environment({
            sceneRenderer: this._sceneRenderer,
            models: this._assetsManager._models,
        });
        this._towerManager = new TowerManager({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });
        this._botManager = new BotManager({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });
        this._spriteManager = new SpriteManager();
        this._particleEffect = new ParticleEffect({
            sceneRenderer: this._sceneRenderer,
            assetsManager: this._assetsManager,
        });
        this._collisionManager = new CollisionManager({
            sceneRenderer: this._sceneRenderer,
            towerManager: this._towerManager,
            botManager: this._botManager,
            spriteManager: this._spriteManager,
            particleEffect: this._particleEffect,
        });
        this._canvasDiv = options.canvas;

        this.initialize();
    }

    initialize() {
        this._canvasDiv.appendChild(this._sceneRenderer._renderer.domElement);

        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this._towerManager.tick();

        this._botManager.tick();

        this._spriteManager.tick();

        this._particleEffect.tick();

        this._collisionManager.tick();

        this._sceneRenderer.render();

        TWEEN.update();
    }
}
