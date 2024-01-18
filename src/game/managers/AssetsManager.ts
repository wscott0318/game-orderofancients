
import { TextureLoader } from "three";

import { MODEL_URLS, S3_BUCKET_URL } from "../../constants";
import { BOT_TYPE } from "../../constants/bot";
import { LoadModel } from "../loaders/ModelLoader";

//

export interface TextureImage {
    img: string;
    texture: THREE.Texture;
}

export class AssetsManager {

    public _models: any;
    public _particleTextures: any;

    //

    constructor () {

        this._models = {};
        this._particleTextures = [];

        this.loadParticleTextures();

    }

    public loadParticleTextures () {

        const particleText1 = S3_BUCKET_URL + "/assets/textures/particle/texture1.png";
        const particleText2 = S3_BUCKET_URL + "/assets/textures/particle/texture2.png";

        const texture1 = new TextureLoader().load(particleText1);
        const texture2 = new TextureLoader().load(particleText2);

        this._particleTextures = [
            {
                img: particleText1,
                texture: texture1,
            },
            {
                img: particleText2,
                texture: texture2,
            },
        ];

    }

    public loadModels () : Promise<boolean> {

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

            this._models.bot_king = await LoadModel(MODEL_URLS["bot_king"]);

            this._models.bot_mage = await LoadModel(MODEL_URLS["bot_mage"]);

            this._models.tower = this._models.buildings.scene.getObjectByName(
                "orc_tower_Lv3_proto_orc_rts_0"
            );

            this._models.throwingAxe = await LoadModel(
                MODEL_URLS["throwingAxe"]
            );

            this._models.arrow = await LoadModel(MODEL_URLS["arrow"]);

            this._models.missile = await LoadModel(MODEL_URLS["missile"]);

            this._models.stone = await LoadModel(MODEL_URLS["stone"]);

            resolve(true);

        });

    }

    public getEnvironmentModel () {

        return this._models.environment.scene;

    }

    public getTowerModel () {

        return this._models.tower;

    }

    public getBotModel ( type: number ) {

        if (type === BOT_TYPE["grunt"]) return this._models.bot_grunt;

        if (type === BOT_TYPE["swordsman"]) return this._models.bot_swordsman;

        if (type === BOT_TYPE["archer"]) return this._models.bot_archer;

        if (type === BOT_TYPE["king"]) return this._models.bot_king;

        if (type === BOT_TYPE["mage"]) return this._models.bot_mage;

    }

}
