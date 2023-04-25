import AssetsManager from "./AssetsManager";
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
    _canvasDiv: HTMLDivElement;

    constructor(options: GameOptions) {
        this._assetsManager = options.assetsManager;
        this._sceneRenderer = new SceneRenderer();
        this._envRenderer = new Environment({
            sceneRenderer: this._sceneRenderer,
            models: this._assetsManager._models,
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

        this._sceneRenderer.render();
    }
}
