import { MODEL_URLS } from "../../constants";
import { LoadModel } from "./loaders/ModelLoader";
import { Environment } from "./rendering/Environment";
import { SceneRenderer } from "./rendering/SceneRenderer";

interface GameOptions {
    canvas: HTMLDivElement;
}

export class Game {
    sceneRenderer: any;
    envRenderer: any;
    models: any;
    enemyArray: any;
    canvasDiv: HTMLDivElement;

    constructor(options: GameOptions) {
        this.models = {};
        this.enemyArray = [];
        this.canvasDiv = options.canvas;
        this.loadAssets();
    }

    async loadAssets() {
        this.models.environment = await LoadModel(MODEL_URLS["environment"]);

        this.initialize();
    }

    initialize() {
        this.sceneRenderer = new SceneRenderer();

        this.envRenderer = new Environment({
            _sceneRenderer: this.sceneRenderer,
            _models: this.models,
        });

        this.canvasDiv.appendChild(this.sceneRenderer._renderer.domElement);

        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.sceneRenderer.render();
    }
}
