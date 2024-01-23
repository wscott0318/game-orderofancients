
import { Object3D, Texture, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { MODEL_URLS, S3_BUCKET_URL } from "../../constants";
import { BOT_TYPE } from "../../constants/bot";
import { LoadModel } from "../loaders/ModelLoader";

//

export interface TextureImage {
    img: string;
    texture: THREE.Texture;
}

export class ResourcesManager {

    public _textures: Map<string, Texture> = new Map();
    public _models: Map<string, Object3D> = new Map();

    private _texturesToLoad: string[];
    private _modelsToLoad: string[];

    private _texturesToLoadCount: number;
    private _modelsToLoadCount: number;

    private _texturesLoadedCount: number;
    private _modelsLoadedCount: number;

    private _textureLoader: TextureLoader;
    private _gltfLoader: GLTFLoader;

    public _particleTextures: any;

    private _callback: () => void;
    private _progressCallback: ( progress: number ) => void;

    //

    public load ( progressCallback: ( progress: number ) => void, callback: () => void ) : void {

        this._progressCallback = progressCallback;
        this._callback = callback;

        // init loaders

        this._textureLoader = new TextureLoader();
        this._gltfLoader = new GLTFLoader();

        //

        this._texturesToLoad = [

        ];

        this._modelsToLoad = [

        ];

        //

        this.loadNextModel();
        this.loadNextTexture();

    }

    public getTexture ( textureName: string ) : Texture | null {

        return this._textures.get( textureName ) ?? null;

    }

    public getModel ( modelName: string ) : Object3D | null {

        return this._models.get( modelName ) ?? null;

    }

    //

    private isFinishedLoading () : boolean {

        const isFinishedLoading = this._texturesLoadedCount === this._texturesToLoadCount && this._modelsLoadedCount === this._modelsToLoadCount;

        if ( isFinishedLoading ) {

            this._callback();

        }

        return isFinishedLoading;

    }

    private loadNextModel () : void {

        const modelUrl = this._modelsToLoad.pop();

        if ( this.isFinishedLoading() ) return;
        if ( ! modelUrl ) return;

        this._gltfLoader.load( modelUrl, ( gltf ) => {

            this._models.set( modelUrl, gltf.scene );
            this._modelsLoadedCount ++;
            // todo: update progress

            if ( ! this.isFinishedLoading() ) {

                this.loadNextModel();

            }

        });

    }

    private loadNextTexture () : void {

        const textureUrl = this._texturesToLoad.pop();

        if ( this.isFinishedLoading() ) return;
        if ( ! textureUrl ) return;

        this._textureLoader.load( textureUrl, ( texture ) => {

            this._textures.set( textureUrl, texture );
            this._texturesLoadedCount ++;
            // todo: update progress

            if ( ! this.isFinishedLoading() ) {

                this.loadNextTexture();

            }

        });

    }

    // methods below will be removed shortly

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
