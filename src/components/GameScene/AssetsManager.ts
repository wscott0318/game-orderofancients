import { BOT_TYPE, MODEL_URLS } from "../../constants";
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
            this._models.buildings = await LoadModel(MODEL_URLS["buildings"]);

            this._models.bot_grunt = await LoadModel(MODEL_URLS["bot_grunt"]);

            this._models.bot_swordsman = await LoadModel(
                MODEL_URLS["bot_swordsman"]
            );

            this._models.bot_archer = await LoadModel(MODEL_URLS["bot_archer"]);

            this._models.tower = this._models.buildings.scene.getObjectByName(
                "orc_tower_Lv3_proto_orc_rts_0"
            );

            resolve(true);
        });
    }

    getEnvironmentModel() {
        return this._models.environment.scene;
    }

    getTowerModel() {
        return this._models.tower;
    }

    getBotModel(type: number) {
        if (type === BOT_TYPE["grunt"]) return this._models.bot_grunt;

        if (type === BOT_TYPE["swordsman"]) return this._models.bot_swordsman;

        if (type === BOT_TYPE["archer"]) return this._models.bot_archer;
    }
}

export default AssetsManager;
