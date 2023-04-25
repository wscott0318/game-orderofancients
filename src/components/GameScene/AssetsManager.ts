import { MODEL_URLS } from "../../constants";
import { LoadModel } from "./loaders/ModelLoader";

export class AssetsManager {
    _models: any;

    constructor() {
        this._models = {};
    }

    loadModels() {
        return new Promise(async (resolve, reject) => {
            this._models.environment = await LoadModel(
                MODEL_URLS["environment"]
            );
            this._models.tower = await LoadModel(MODEL_URLS["tower"]);

            resolve(true);
        });
    }
}

export default AssetsManager;
