import { MODEL_URLS } from "../../constants";
import { BOT_TYPE } from "../../constants/bot";
import { LoadModel } from "./loaders/ModelLoader";
import * as THREE from "three";

export interface TextureImage {
    img: string;
    texture: THREE.Texture;
}

export class AssetsManager {
    _models: any;
    _particleTextures: any;

    constructor() {
        this._models = {};
        this._particleTextures = [];

        this.loadParticleTextures();
    }

    loadParticleTextures() {
        const texture1 = new THREE.TextureLoader().load(
            "/assets/textures/particle/texture1.png"
        );
        const texture2 = new THREE.TextureLoader().load(
            "/assets/textures/particle/texture2.png"
        );

        this._particleTextures = [
            {
                img: "/assets/textures/particle/texture1.png",
                texture: texture1,
            },
            {
                img: "/assets/textures/particle/texture2.png",
                texture: texture2,
            },
        ];
    }

    loadModels() {
        return new Promise(async (resolve, reject) => {
            const element = document.getElementsByClassName(
                "progress-bar2"
            )[0] as HTMLDivElement;
            element.style.width = "20%";

            this._models.environment = await LoadModel(
                MODEL_URLS["environment"]
            );

            element.style.width = "50%";

            this._models.buildings = await LoadModel(MODEL_URLS["buildings"]);

            element.style.width = "70%";

            this._models.bot_grunt = await LoadModel(MODEL_URLS["bot_grunt"]);

            element.style.width = "77%";

            this._models.bot_swordsman = await LoadModel(
                MODEL_URLS["bot_swordsman"]
            );

            element.style.width = "85%";

            this._models.bot_archer = await LoadModel(MODEL_URLS["bot_archer"]);

            element.style.width = "93%";

            this._models.bot_king = await LoadModel(MODEL_URLS["bot_king"]);

            element.style.width = "100%";

            this._models.bot_mage = await LoadModel(MODEL_URLS["bot_mage"]);

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

        if (type === BOT_TYPE["king"]) return this._models.bot_king;

        if (type === BOT_TYPE["mage"]) return this._models.bot_mage;
    }
}

export default AssetsManager;
