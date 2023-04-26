import AssetsManager from "./AssetsManager";
import { BotManager } from "./BotManager";
import { TowerManager } from "./TowerManager";
import { Environment } from "./rendering/Environment";
import { SceneRenderer } from "./rendering/SceneRenderer";

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

        this._sceneRenderer.render();
    }
}
