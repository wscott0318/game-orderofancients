import { TOWER_POSITION } from "../../constants";
import AssetsManager from "./AssetsManager";
import { Tower } from "./Instances/Tower";
import { SceneRenderer } from "./rendering/SceneRenderer";

export class TowerManager {
    _tower: Tower;
    _towerMesh: any;
    _sceneRenderer: SceneRenderer;
    _assetsManager: AssetsManager;

    constructor({ sceneRenderer, assetsManager }: any) {
        this._sceneRenderer = sceneRenderer;
        this._assetsManager = assetsManager;

        this._tower = new Tower();
        this._towerMesh = this._assetsManager.getTowerModel();

        this.initialize();
    }

    initialize() {
        this._towerMesh.position.x = TOWER_POSITION.x;
        this._towerMesh.position.y = TOWER_POSITION.y;
        this._towerMesh.position.z = TOWER_POSITION.z;
        this._sceneRenderer.getScene().add(this._towerMesh);
    }

    tick() {}
}
